from fastapi import FastAPI, APIRouter,HTTPException, Query, Body, Request
from fastapi.responses import JSONResponse
import pyodbc
import os
from datetime import date, datetime
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel, Field, validator
from typing import List, Optional
from openai import AzureOpenAI
from requests.auth import HTTPBasicAuth
import json
from pyodbc import IntegrityError
import logging
from uuid import uuid4
from enum import Enum
import torch
from torch import Tensor
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

#Get the API KEY
os.environ["AZURE_OPENAI_KEY"] = "ec442c4a9f864b508f97504f7d7e687b"
os.environ["AZURE_OPENAI_ENDPOINT"] = "https://rgacademy3oai.openai.azure.com/"
api_key = os.getenv("AZURE_OPENAI_KEY")
client = AzureOpenAI ( azure_endpoint = "https://rgacademy3oai.openai.azure.com/",
                      api_key = os.getenv("AZURE_OPENAI_KEY"),
                      api_version = "2024-02-15-preview", timeout=30,
)

app=FastAPI()

model = None



# if os is not mac , abort the app
# if os.name != 'posix':
#    raise Exception('This app is only for Mac OS')

# if os is windows , abort the app
# elif os.name != 'nt':
#    raise Exception('This app is only for Windows OS')

# Set Azure SQL connection string directly in the script
conn_str = 'Driver={ODBC Driver 17 for SQL Server};Server=tcp:ncf.database.windows.net,1433;Database=NCFDB;UID=user1;PWD=Deneme12345;Encrypt=yes;TrustServerCertificate=no;Connection Timeout=30'

# Veritabanı bağlantısı oluşturma
conn = pyodbc.connect(conn_str)

class Complaint(BaseModel):
    id: Optional[int]
    user_id: Optional[int]
    tc: str = Field(..., max_length=11)
    ad: str = Field(..., max_length=255)
    soyad: str = Field(..., max_length=255)
    tel: Optional[str]
    request: Optional[str]
    request_date: Optional[date]
    request_status: Optional[str]
    catagory: Optional[str] = Field(None, max_length=50)

    @validator('request_date', pre=True, allow_reuse=True)
    def format_date(cls, value):
        if isinstance(value, date):
            return value.strftime('%Y-%m-%d')
       

class User(BaseModel):
    ad: str
    soyad: str
    tc: str
    tel: str

# FastAPI event to load the model at startup
@app.on_event("startup")
def load_model():
    global model
    model = SentenceTransformer('all-MiniLM-L6-v2')


prompt= "Sen, banka müşterilerinin şikayetlerini belirli kategorilere göre sınıflandıran bir yapay zeka asistanısın. Müşterilerden gelen yorumları, aşağıda belirtilen kategorilere göre sınıflandıracaksın. Eğer sınıflandırma dışında bir taleple karşılaşırsan, 'Üzgünüm, sadece sınıflandırma işlemlerini uyguluyorum.' şeklinde yanıt vereceksin. Sınıflandırma Kategorileri: MobilDeniz, ATM, İnternet Bankacılığı, Bireysel Kredi Kartları, Debit Kartlar, Yatırım İşlemleri, Para Transferi, Vadeli Mevduat, Hesap Kart Bloke Kaldırma, EFL/HAVAL Teyit, Dolandırcılık/Bilgi Dışı Şüpheli Hesap Kart İşlemleri, Bilgi/Belge Sahteciliği/Kayıp, Konut Sigortası, Bireysel Hayat Sigortası, Ferdi Kaza Sigortası, İletişim Merkezi. Vereceğin cevap formatı sadece İlgili kategoriyi belirtmelisin başka hiçbir şey yazmamalısın."



def read_json_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        data = json.load(file)
        return data['messages']
   
def semantic_search(query, messages, model, top_k=20):
    content_list = [msg['content'] for msg in messages]
    query_embedding = model.encode([query])
    content_embeddings = model.encode(content_list)
   
    similarities = cosine_similarity(query_embedding, content_embeddings)[0]
    top_indices = np.argsort(similarities)[-top_k:][::-1]
   
    return [messages[i] for i in top_indices]
   
file_path = 'few_shots.json'
message_text = read_json_file(file_path)

   
# Adjust the endpoint to fetch and return all required data:
class UserQuery(BaseModel):
    query: str

@app.post("/classify-query/")
async def classify_query(user_query: UserQuery):
    try:
        # Load messages and model (this should ideally be loaded once, consider using app startup events)
        file_path = 'few_shots.json'
        all_messages = read_json_file(file_path)
       

        # Perform semantic search
        relevant_messages = semantic_search(user_query.query, all_messages, model)
       
        # Prepare messages for Azure OpenAI
        message_text = [{"role": "assistant", "content": prompt}] + relevant_messages + [{"role": "user", "content": user_query.query}]
       
        # Call Azure OpenAI API
        completion = client.chat.completions.create(
            model="gpt-4o",
            messages=message_text,
            max_tokens=4096,
            temperature=0.7,
            top_p=0.95,
            stop=None
        )
       
        # Extract the assistant's response
        assistant_response = completion.choices[0].message.content
        return {"response": assistant_response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
 


@app.get("/")
def root():
    return {"message": "Hello World"}

@app.get("/admin_bilgileri")
async def get_admin_bilgileri():
    try:
        cursor = conn.cursor()
        # Fetching only admin IDs and usernames
        cursor.execute('SELECT admin_id, kullanici_adi FROM dbo.admin_bilgileri')
        rows = cursor.fetchall()
        columns = [column[0] for column in cursor.description]
        result = [dict(zip(columns, row)) for row in rows]
        return JSONResponse(content=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/admin/login")
async def admin_login(form_data: OAuth2PasswordRequestForm = Depends()):
    try:
        cursor = conn.cursor()
        # Using parameterized queries to prevent SQL Injection
        cursor.execute("SELECT kullanici_sifre FROM dbo.admin_bilgileri WHERE kullanici_adi = ?", form_data.username)
        admin = cursor.fetchone()
        if admin and admin[0] == form_data.password:
            return {"message": "Login successful"}
        else:
            raise HTTPException(status_code=401, detail="Geçersiz giriş")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
@app.get("/kullanici_bilgileri")
async def get_kullanici_bilgileri():
    try:
        cursor = conn.cursor()
        cursor.execute('SELECT user_id, ad, soyad, tc, tel FROM dbo.kullanici_bilgileri')
        rows = cursor.fetchall()
        columns = [column[0] for column in cursor.description]
        result = [dict(zip(columns, row)) for row in rows]
        return JSONResponse(content=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/kullanici_bilgileri", response_model=User, status_code=status.HTTP_201_CREATED)
async def create_kullanici_bilgileri(user: User):
    try:
        # Connect to the database
            cursor = conn.cursor()
            # Prepare the SQL command
            sql_command = """
                INSERT INTO dbo.kullanici_bilgileri (ad, soyad, tc, tel)
                VALUES (?, ?, ?, ?)
            """
            # Execute the SQL command
            cursor.execute(sql_command, (user.ad, user.soyad, user.tc, user.tel))
            conn.commit()
            # Optionally, fetch and return the ID of the created user
            cursor.execute("SELECT @@IDENTITY AS id;")
            user_id = cursor.fetchone()[0]
            return {
                "id": user_id,
                "ad": user.ad,
                "soyad": user.soyad,
                "tc": user.tc,
                "tel": user.tel
            }
    except pyodbc.Error as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Database hatası: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Hata: {str(e)}")



@app.put("/kullanici_bilgileri/{user_id}")
async def update_kullanici_bilgileri(user_id: int, ad: str = Body(...), soyad: str = Body(...), tc: str = Body(...), tel: str = Body(...)):
    try:
        cursor = conn.cursor()
        cursor.execute('UPDATE dbo.kullanici_bilgileri SET ad = ?, soyad = ?, tc = ?, tel = ? WHERE user_id = ?', ad, soyad, tc, tel, user_id)
        conn.commit()
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Kullanıcı bulunamadı")
        return {"message": "Kullanıcı bilgileri başarıyla güncellendi"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/kullanici_bilgileri")
async def get_kullanici_bilgileri():
    try:
        cursor = conn.cursor()
        cursor.execute('SELECT user_id, ad, soyad, tc, tel FROM dbo.kullanici_bilgileri')
        rows = cursor.fetchall()
        columns = [column[0] for column in cursor.description]
        result = [dict(zip(columns, row)) for row in rows]
        return JSONResponse(content=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
   
@app.post("/kullanici_bilgileri", status_code=status.HTTP_201_CREATED)
async def create_kullanici_bilgileri(user: User):
    try:
        # Connect to the database
        cursor = conn.cursor()
        # Insert the new user into the database
        cursor.execute(
            "INSERT INTO dbo.kullanici_bilgileri (ad, soyad, tc, tel) VALUES (?, ?, ?, ?)",
            (user.ad, user.soyad, user.tc, user.tel)
        )
        conn.commit()
    except pyodbc.DatabaseError as e:
        error = str(e)
        if 'IDENTITY_INSERT' in error:
            raise HTTPException(status_code=400, detail="Bu değer girilemiyor")
        else:
            raise HTTPException(status_code=500, detail=f"Database hatası: {error}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Kullanıcı oluşturulamadı: {str(e)}")


@app.put("/kullanici_bilgileri/{user_id}")
async def update_kullanici_bilgileri(user_id: int, ad: str = Body(...), soyad: str = Body(...), tc: str = Body(...), tel: str = Body(...)):
    try:
        cursor = conn.cursor()
        cursor.execute('UPDATE dbo.kullanici_bilgileri SET ad = ?, soyad = ?, tc = ?, tel = ? WHERE user_id = ?', ad, soyad, tc, tel, user_id)
        conn.commit()
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Kullanıcı bulunamadı")
        return {"message": "Kullanıcı bilgileri başarıyla güncellendi"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
 

@app.get("/requests_response_sorted/recent_to_old", response_model=List[Complaint])
async def get_requests_response_sorted():
    try:
        cursor = conn.cursor()
        query = '''
            SELECT id, user_id, tc, ad, soyad, request, request_date, request_status, catagory, tel
            FROM dbo.requests_response
            ORDER BY request_date DESC
        '''
        cursor.execute(query)
        rows = cursor.fetchall()
       
        result = [{
            'id': row.id,
            'user_id': row.user_id,
            'tc': row.tc,
            'ad': row.ad,
            'soyad': row.soyad,
            'request': row.request,
            'request_date': row.request_date.strftime("%Y-%m-%d") if row.request_date else None,
            'request_status': row.request_status,
            'catagory': row.catagory,
            'tel': row.tel
        } for row in rows]
        return JSONResponse(content=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to sort complaints: {str(e)}")
   
@app.get("/requests_response_sorted/old_to_rec", response_model=List[Complaint])
async def requests_response_sorted():
    try:
        cursor = conn.cursor()
        query = '''
            SELECT id, user_id, tc, ad, soyad, request, request_date, request_status, catagory
            FROM dbo.requests_response
            ORDER BY request_date ASC
        '''
        cursor.execute(query)
        rows = cursor.fetchall()
       
        result = [{
            'id': row.id,
            'user_id': row.user_id,
            'tc': row.tc,
            'ad': row.ad,
            'soyad': row.soyad,
            'request': row.request,
            'request_date': row.request_date.strftime("%Y-%m-%d") if row.request_date else None,
            'request_status': row.request_status,
            'catagory': row.catagory
        } for row in rows]
        return JSONResponse(content=result)
    except Exception as e: