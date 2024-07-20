from fastapi import FastAPI, APIRouter,HTTPException, Query, Body, Request
from fastapi.responses import JSONResponse
import pyodbc
import os
from datetime import date, datetime
import uuid
from datetime import date, datetime
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel, Field, validator, field_validator
from typing import List, Optional
from openai import AzureOpenAI
from requests.auth import HTTPBasicAuth
import json


#Get the API KEY 
os.environ["AZURE_OPENAI_KEY"] = "ec442c4a9f864b508f97504f7d7e687b" 
os.environ["AZURE_OPENAI_ENDPOINT"] = "https://rgacademy3oai.openai.azure.com/" 
api_key = os.getenv("AZURE_OPENAI_KEY") 
client = AzureOpenAI ( azure_endpoint = "https://rgacademy3oai.openai.azure.com/", 
                      api_key = os.getenv("AZURE_OPENAI_KEY"), 
                      api_version = "2024-02-15-preview", timeout=30,
)

app=FastAPI()



# if os is not mac , abort the app
# if os.name != 'posix':
#    raise Exception('This app is only for Mac OS')

# if os is windows , abort the app
# elif os.name != 'nt':
#    raise Exception('This app is only for Windows OS')

# connection string 
conn_str = 'Driver={ODBC Driver 17 for SQL Server};Server=tcp:ncf.database.windows.net,1433;Database=NCFDB;UID=user3;PWD=Deneme12345;Encrypt=yes;TrustServerCertificate=no;Connection Timeout=30'

# Veritabanı bağlantısı oluşturma
conn = pyodbc.connect(conn_str)

class Complaint(BaseModel):
    id: Optional[int]
    user_id: int
    tc: str = Field(..., max_length=11)
    ad: str = Field(..., max_length=255)
    soyad: str = Field(..., max_length=255)
    request: Optional[str]
    request_date: Optional[date]
    request_status: Optional[str]
    catagory: Optional[str] = Field(None, max_length=50)

    @field_validator('request_date', mode='before')
    def format_date(cls, v):
        return v.strftime('%Y-%m-%d') if v else None

def read_json_file(file_path):
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"The file {file_path} does not exist.")
    with open(file_path, 'r', encoding='utf-8') as file:
        data = json.load(file)
        return data['messages']

file_path = 'few_shots.json'
try:
    message_text = read_json_file(file_path)
except FileNotFoundError as e:
    print(e)
    message_text = []  # Default value if the file is not found

   
@app.post("/chat/", response_model=Complaint)
async def chat_with_openai(ad: str = Body(...), soyad: str = Body(...), tc: str = Body(...), tel: str = Body(...), user_input: str = Body(...)):
    try:
        cursor = conn.cursor()
       
        # Ensure required fields are present
        if not all([ad, soyad, tc, user_input]):
            raise HTTPException(status_code=400, detail="Missing one or more required fields.")
       
        # Check if the user already exists
        cursor.execute("SELECT user_id FROM kullanici_bilgileri WHERE tc = ?", tc)
        user_info = cursor.fetchone()

        if user_info:
            user_id = user_info[0]
        else:
            # Insert new user if not exists and fetch the newly created user_id
            cursor.execute("INSERT INTO kullanici_bilgileri (ad, soyad, tc, tel) VALUES (?, ?, ?, ?)", ad, soyad, tc, tel)
            conn.commit()  # Commit to ensure the user is added before fetching user_id
            cursor.execute("SELECT SCOPE_IDENTITY();")  # Retrieve the last inserted identity in the current scope
            user_id = cursor.fetchone()[0]

        if user_id is None:
            raise HTTPException(status_code=500, detail="Failed to create or retrieve user_id")

        # Simulate AI response (replace with actual AI interaction)
        ai_response = "Simulated AI response for testing; replace with actual AI call."

        # Insert the complaint into the database
        cursor.execute('''
            INSERT INTO dbo.requests_response (user_id, tc, ad, soyad, tel, request, request_date, request_status, catagory)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (user_id, tc, ad, soyad, tel, user_input, date.today(), 'cozulmedi', ai_response))
        conn.commit()
        complaint_id = cursor.execute('SELECT @@IDENTITY AS id;').fetchone()[0]

        return Complaint(
            id=complaint_id,
            user_id=user_id,
            tc=tc,
            ad=ad,
            soyad=soyad,
            tel=tel,
            request=user_input,
            request_date=date.today(),
            request_status='cozulmedi',
            catagory=ai_response
        )

    except pyodbc.Error as e:
        conn.rollback()
        logging.error(f"Database error: {e}")
        raise HTTPException(status_code=500, detail=f"Database error: {e}")
    except Exception as e:
        conn.rollback()
        logging.error(f"General error: {e}")
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
    finally:
        cursor.close()

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
            raise HTTPException(status_code=401, detail="Geçersiz giriiş")
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

@app.post("/kullanici_bilgileri")
async def create_kullanici_bilgileri(ad: str = Body(...), soyad: str = Body(...), tc: str = Body(...), tel: str = Body(...)):
    try:
        user_id = str(uuid.uuid4())  # UUID oluşturun
        cursor = conn.cursor()

        # IDENTITY_INSERT ayarını açın
        cursor.execute('SET IDENTITY_INSERT dbo.kullanici_bilgileri ON')

        # Veritabanına yeni kullanıcı ekleyin
        cursor.execute(
            'INSERT INTO dbo.kullanici_bilgileri (user_id, ad, soyad, tc, tel) VALUES (?, ?, ?, ?, ?)',
            (user_id, ad, soyad, tc, tel)
        )

        # IDENTITY_INSERT ayarını kapatın
        cursor.execute('SET IDENTITY_INSERT dbo.kullanici_bilgileri OFF')

        conn.commit()

        return {"message": "Kullanıcı başarıyla oluşturuldu"}
    except Exception as e:
        conn.rollback()  # Hata durumunda işlemi geri al
        raise HTTPException(status_code=500, detail=str(e))

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
            SELECT id, user_id, tc, ad, soyad, request, request_date, request_status, catagory
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
            'catagory': row.catagory
        } for row in rows]
        return JSONResponse(content=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Şikayetler sıralanamadı.: {str(e)}")
    
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
        raise HTTPException(status_code=500, detail=f"Şikayetler sıralanamadı.: {str(e)}")

# updating the status
@app.put("/requests_response/{id}/status")
async def update_request_status(id: int, status: str = Body(..., embed=True)):
    valid_statuses = ['cozuldu', 'cozuluyor', 'cozulmedi']
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

@app.get("/requests_response/by_category", response_model=List[Complaint])
async def get_complaints_by_category(catagory: str = Query(..., description="Enter the category you wish to see.")):
    try:
        cursor = conn.cursor()
        query = '''
            SELECT id, user_id, tc, ad, soyad, request, request_date, request_status, catagory
            FROM dbo.requests_response
            WHERE catagory = ?
            ORDER BY request_date DESC
        '''
        cursor.execute(query, catagory)
        rows = cursor.fetchall()

        if not rows:
            raise HTTPException(status_code=404, detail="Bu kategoride şikayet bulunamadı")

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
        raise HTTPException(status_code=500, detail=f"Şikayetler görülemiyor.: {str(e)}")







if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='127.0.0.1', port=8002)