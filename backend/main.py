from fastapi import FastAPI, APIRouter,HTTPException, Query, Body, Request
from fastapi.responses import JSONResponse
import pyodbc
import os
from datetime import date, datetime
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel, Field, validator, field_validator
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
from fastapi.middleware.cors import CORSMiddleware

#Get the API KEY
os.environ["AZURE_OPENAI_KEY"] = "ec442c4a9f864b508f97504f7d7e687b"
os.environ["AZURE_OPENAI_ENDPOINT"] = "https://rgacademy3oai.openai.azure.com/"
api_key = os.getenv("AZURE_OPENAI_KEY")
client = AzureOpenAI ( azure_endpoint = "https://rgacademy3oai.openai.azure.com/",
                      api_key = os.getenv("AZURE_OPENAI_KEY"),
                      api_version = "2024-02-15-preview", timeout=30,
)

app=FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)


model = None



# if os is not mac , abort the app
# if os.name != 'posix':
#    raise Exception('This app is only for Mac OS')

# if os is windows , abort the app
# elif os.name != 'nt':
#    raise Exception('This app is only for Windows OS')

# Set Azure SQL connection string directly in the script
conn_str = 'Driver={ODBC Driver 17 for SQL Server};Server=tcp:ncf.database.windows.net,1433;Database=NCFDB;UID=user1;PWD=Deneme12345;Encrypt=yes;TrustServerCertificate=no;Connection Timeout=30'
conn_str = 'Driver={ODBC Driver 17 for SQL Server};Server=tcp:ncf.database.windows.net,1433;Database=NCFDB;UID=user1;PWD=Deneme12345;Encrypt=yes;TrustServerCertificate=no;Connection Timeout=30'

# Veritabanı bağlantısı oluşturma
conn = pyodbc.connect(conn_str)

class Complaint(BaseModel):
    id: Optional[int]
    user_id: Optional[int]
    user_id: Optional[int]
    tc: str = Field(..., max_length=11)
    ad: str = Field(..., max_length=255)
    soyad: str = Field(..., max_length=255)
    tel: Optional[str]
    tel: Optional[str]
    request: str
    request_date: Optional[date]
    request_status: str = 'Çözülmedi'
    catagory: Optional[str] = Field(None, max_length=50)

    @field_validator('request_date', mode='before')
    def format_date(cls, value):
        if isinstance(value, date):
            return value.strftime('%Y-%m-%d')
       

class User(BaseModel):
    ad: str
    soyad: str
    tc: str
    tel: str


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
   
file_path = 'few_shot.json'
message_text = read_json_file(file_path)

   
# Adjust the endpoint to fetch and return all required data:
class UserQuery(BaseModel):
    query: str

@app.post("/classify-query/")
async def classify_query(user_query: Complaint):
    try:

        cursor = conn.cursor()

        # Load messages and model (this should ideally be loaded once, consider using app startup events)
        file_path = 'few_shot.json'
        all_messages = read_json_file(file_path)
       

        # Perform semantic search
        relevant_messages = semantic_search(user_query.request, all_messages, model)
       
        # Prepare messages for Azure OpenAI
        message_text = [{"role": "assistant", "content": prompt}] + relevant_messages + [{"role": "user", "content": user_query.request}]
       
        # Call Azure OpenAI API
        completion = client.chat.completions.create(
            model="gpt-4o",
            messages=message_text,
            max_tokens=4096,
            temperature=0.7,
            top_p=0.95,
            stop=None
        )
       
        assistant_response =  completion.choices[0].message.content.strip()
        user_query.catagory = assistant_response

         # Insert into the database
        cursor.execute('''
            INSERT INTO dbo.requests_response (user_id, tc, ad, soyad, tel, request, request_date, request_status, catagory)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (user_query.user_id, user_query.tc, user_query.ad, user_query.soyad, user_query.tel, user_query.request, date.today(), 'Çözülmedi', user_query.catagory))
        conn.commit()
        user_query.id = cursor.execute("SELECT @@IDENTITY AS id;").fetchval()
        return user_query
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"AI processing or database error: {str(e)}")
    finally:
        cursor.close()
        conn.close()

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
            'INSERT INTO dbo.kullanici_bilgileri (ad, soyad, tc, tel) VALUES (?, ?, ?, ?)',
            user.ad, user.soyad, user.tc, user.tel
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
        raise HTTPException(status_code=500, detail=f"Şikayetler sıralanamadı: {str(e)}")

# updating the status
@app.put("/requests_response/{id}/status")
async def update_request_status(id: int, status: str = Body(..., embed=True)):
    valid_statuses = ['Çözüldü', 'Çözülüyor', 'Çözülmedi']
    if status not in valid_statuses:
        raise HTTPException(status_code=400, detail="İşlem geçersiz.")

    try:
        cursor = conn.cursor()
        cursor.execute('''
            UPDATE dbo.requests_response
            SET request_status = ?
            WHERE id = ?
        ''', status, id)
        conn.commit()

        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Şikayet bulunamadı")

        return JSONResponse(content={"message": "Şikayet durumu güncellendi"})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
   

# kategori
class CategoryEnum(str, Enum):
    mobil_deniz = "MobilDeniz"
    bireysel_kredi_kartlari = "Bireysel Kredi Kartları"
    debit_kartlar = "Debit Kartlar"
    yatirim_islemleri = "Yatırım İşlemleri"
    dijital_bankacilik = "ATM"
    dij_bankacilik = "İnternet Bankacılığı"
    para_transferi = "Para Transferi"
    vadeli_mevduat = "Vadeli Mevduat"
    hesap_kart_bloke_kaldirma = "Hesap/Kart Bloke Kaldırma"
    fraud = "EFT/ Havale Teyit"
    dolandiricilik_bilgi_disi_suphe = "Dolandırıcılık-Bilgi Dışı Şüph. Hesap-Kart İşl."
    bilgi_belge_sahtecilik_kayip = "Bilgi/Belge Sahtecilik/Kayıp"
    konut_sigortasi = "Konut Sigortası"
    bireysel_kredi_hayat_sigortasi = "Bireysel Kredi Hayat Sigortası"
    ferdi_kaza = "Ferdi Kaza Sigortası"
    iletisim_merkezi = "İletişim Merkezi"


@app.get("/requests_response/by_category", response_model=List[Complaint])
async def get_complaints_by_category(category: CategoryEnum = Query(..., description="Görmek istediğiniz kategoriyi seçiniz.")):
    try:
       
       
        cursor = conn.cursor()
        query = '''
            SELECT id, user_id, tc, ad, soyad, request, request_date, request_status, catagory, tel
            FROM dbo.requests_response
            WHERE catagory = ?
            ORDER BY request_date DESC
        '''
        cursor.execute(query, category.value)
        rows = cursor.fetchall()
        conn.close()

        if not rows:
            raise HTTPException(status_code=404, detail="Bu kategoride şikayet bulunamadı")

        result = [Complaint(
            id=row.id,
            user_id=row.user_id,
            tc=row.tc,
            ad=row.ad,
            soyad=row.soyad,
            request=row.request,
            request_date=row.request_date,
            request_status=row.request_status,
            catagory=row.catagory,
            tel = row.tel
        ) for row in rows]
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Şikayetler gösterilemiyor: {str(e)}")


if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='127.0.0.1', port=8002)
