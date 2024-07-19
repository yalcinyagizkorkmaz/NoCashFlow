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




#Get the API KEY 
os.environ["AZURE_OPENAI_KEY"] = "*******" 
os.environ["AZURE_OPENAI_ENDPOINT"] = "https://******.openai.azure.com/" 
api_key = os.getenv("AZURE_OPENAI_KEY") 
client = AzureOpenAI ( azure_endpoint = "https://******.openai.azure.com/", 
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

# Set Azure SQL connection string directly in the script
conn_str = 'Driver={ODBC Driver 17 for SQL Server};Server=tcp:ncf.database.windows.net,1433;Database=NCFDB;UID=user3;PWD=Deneme12345;Encrypt=yes;TrustServerCertificate=no;Connection Timeout=30'

# Veritabanı bağlantısı oluşturma
conn = pyodbc.connect(conn_str)

class Complaint(BaseModel):
    id: Optional[int]  # Automatically handled by the database
    user_id: int
    tc: str = Field(..., max_length=11)
    ad: str = Field(..., max_length=255)
    soyad: str = Field(..., max_length=255)
    request: Optional[str]  # Can be null
    request_date: Optional[date]  # Can be null, handle formatting if inputting
    request_status: Optional[str]  # Can be null
    catagory: Optional[str] = Field(None, max_length=50)  # Can be null

    @validator('request_date', pre=True, always=True)
    def format_date(cls, v):
        return v.strftime('%Y-%m-%d') if v else None



def read_json_file(file_path): 
    with open(file_path, 'r', encoding='utf-8') as file:
        data = json.load(file) 
        return data['messages']
    
file_path = 'few_shots.json'
message_text = read_json_file(file_path)

   
# Endpoint to handle "chat" which creates complaints
@app.post("/chat/", response_model=Complaint)
async def chat_with_openai(user_input: str, user_id: int):
    # Retrieve user details from the kullanici_bilgileri table
    cursor = conn.cursor()
    cursor.execute('SELECT tc, ad, soyad FROM dbo.kullanici_bilgileri WHERE user_id = ?', user_id)
    user_details = cursor.fetchone()
    if not user_details:
        raise HTTPException(status_code=404, detail="User not found")
    tc, ad, soyad = user_details

    message_text.append({"role": "user", "content": user_input})

    # Create the chat prompt and get response from OpenAI
    completion = client.chat.completions.create(
        model="gpt-4o",
        messages=message_text,
        max_tokens=4096,
        temperature=0.7,
        top_p=0.95,
        stop=None
    )
    ai_response = completion.choices[0].message.content.strip()

    # Store the user input and AI response in the database
    try:
        cursor.execute('''
            INSERT INTO dbo.requests_response (tc, ad, soyad, request, request_date, request_status, catagory, user_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (tc, ad, soyad, user_input, date.today(), 'cozulmedi', ai_response, user_id))
        conn.commit()
        request_id = cursor.execute('SELECT @@IDENTITY AS id').fetchval()
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Şikayet database'e eklenemedi.: {str(e)}")

    # Return the data as a response model
    return {
        "tc": tc,
        "ad": ad,
        "soyad": soyad,
        "request": user_input,
        "request_date": date.today(),
        "request_status": 'cozulmedi',
        "catagory": ai_response,
        "user_id": user_id
    }


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
        cursor = conn.cursor()
        cursor.execute('INSERT INTO dbo.kullanici_bilgileri (ad, soyad, tc, tel) VALUES (?, ?, ?, ?)', ad, soyad, tc, tel)
        conn.commit()
        return {"message": "Kullanıcı başarıyla oluşturuldu"}
    except Exception as e:
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
        cursor = conn.cursor()
        cursor.execute('INSERT INTO dbo.kullanici_bilgileri (ad, soyad, tc, tel) VALUES (?, ?, ?, ?)', ad, soyad, tc, tel)
        conn.commit()
        return {"message": "Kullanıcı başarıyla oluşturuldu"}
    except Exception as e:
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