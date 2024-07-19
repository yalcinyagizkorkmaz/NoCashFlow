from fastapi import FastAPI, APIRouter,HTTPException, Query, Body, Request
from fastapi.responses import JSONResponse
import pyodbc
import os
from datetime import date
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel, Field
from typing import List
from openai import AzureOpenAI
from requests.auth import HTTPBasicAuth
import json




#Get the API KEY 
os.environ["AZURE_OPENAI_KEY"] = "*******" 
os.environ["AZURE_OPENAI_ENDPOINT"] = "https://******.openai.azure.com/" 
api_key = os.getenv("AZURE_OPENAI_KEY") 
client = AzureOpenAI ( azure_endpoint = "https://**********.openai.azure.com/", 
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
    tc: str = Field(..., max_length=11)
    ad: str
    soyad: str
    request: str
    request_date: date = Field(default_factory=date.today)
    request_status: str = Field(default="cozulmedi")
    catagory: str
    user_id: int


def read_json_file(file_path): 
    with open(file_path, 'r', encoding='utf-8') as file:
        data = json.load(file) 
        return data['messages']
    
file_path = 'few_shots.json'
message_text = read_json_file(file_path)

# Endpoint to handle "chat" which creates complaints
@app.post("/chat/", response_model=Complaint)
async def chat_with_openai(user_input: str, user_id: int):
    file_path = 'few_shots.json'
    message_text = read_json_file(file_path)
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
    cursor = conn.cursor()
    try:
        cursor.execute('''
            INSERT INTO dbo.requests_response (tc, ad, soyad, request, request_date, request_status, catagory, user_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', ('example_tc', 'example_ad', 'example_soyad', user_input, date.today(), 'cozulmedi', ai_response, user_id))
        conn.commit()
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to store complaint: {str(e)}")

    # Return the data as a response model
    return {
        "tc": 'example_tc',  # Example value, replace with actual
        "ad": 'example_ad',  # Example value, replace with actual
        "soyad": 'example_soyad',  # Example value, replace with actual
        "request": user_input,
        "request_date": date.today(),
        "request_status": 'cozulmedi',  # Default or dynamic value based on logic
        "catagory": ai_response,  # Example category, replace or adjust logic
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
            raise HTTPException(status_code=401, detail="Invalid credentials")
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

@app.get("/requests_response", response_model=List[Complaint])
async def get_all_complaints():
    try:
        # Create a database cursor
        cursor = conn.cursor()
       
        # Execute the SQL query to select all complaints
        cursor.execute("SELECT * FROM dbo.requests_response")
        rows = cursor.fetchall()
       
        # Convert rows to Pydantic model instances
        complaints = [Complaint(
            tc=row.tc,
            ad=row.ad,
            soyad=row.soyad,
            request=row.request,
            request_date=row.request_date,
            request_status=row.request_status,
            catagory=row.catagory,
            user_id=row.user_id
        ) for row in rows]
       
        return complaints
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Şikayetlere ulaşılamıyor.: {str(e)}")
    
 # recent sikayetten eskiye   
@app.get("/requests_response_sorted")
async def get_requests_response_sorted(tc: str = Query(None)):
    try:
        cursor = conn.cursor()
        if tc:
            query = '''
                SELECT
                    id,
                    tc,
                    ad,
                    soyad,
                    request,
                    request_date,
                    request_status,
                    catagory,
                    user_id
                FROM
                    dbo.requests_response
                WHERE
                    tc = ?
                ORDER BY request_date DESC
            '''
            cursor.execute(query, tc)
        else:
            query = '''
                SELECT
                    id,
                    tc,
                    ad,
                    soyad,
                    request,
                    request_date,
                    request_status,
                    catagory,
                    user_id
                FROM
                    dbo.requests_response
                ORDER BY request_date DESC
            '''
            cursor.execute(query)
       
        rows = cursor.fetchall()
        columns = [column[0] for column in cursor.description]
        result = [dict(zip(columns, row)) for row in rows]
        return JSONResponse(content=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
 # eskiden yeniye 
@app.get("/requests_response_old_to_new")
async def get_requests_response_sorted(tc: str = Query(None)):
    try:
        cursor = conn.cursor()
        if tc:
            query = '''
                SELECT
                    id,
                    tc,
                    ad,
                    soyad,
                    request,
                    request_date,
                    request_status,
                    catagory,
                    user_id
                FROM
                    dbo.requests_response
                WHERE
                    tc = ?
                ORDER BY request_date ASC
            '''
            cursor.execute(query, tc)
        else:
            query = '''
                SELECT
                    id,
                    tc,
                    ad,
                    soyad,
                    request,
                    request_date,
                    request_status,
                    catagory,
                    user_id
                FROM
                    dbo.requests_response
                ORDER BY request_date ASC
            '''
            cursor.execute(query)
       
        rows = cursor.fetchall()
        columns = [column[0] for column in cursor.description]
        result = [dict(zip(columns, row)) for row in rows]
        return JSONResponse(content=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

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

@app.get("/requests_response/by_category")
async def get_complaints_by_category(catagory: str = Query(..., description="Görmek istediğiniz kategoriyi yazınız.")):
    try:
        cursor = conn.cursor()
        query = '''
            SELECT id, tc, ad, soyad, request, request_date, request_status, catagory, user_id
            FROM dbo.requests_response
            WHERE catagory = ?
            ORDER BY request_date DESC
        '''
        cursor.execute(query, catagory)
        rows = cursor.fetchall()

        if not rows:
            raise HTTPException(status_code=404, detail="No complaints found for this category")

        columns = [column[0] for column in cursor.description]
        result = [dict(zip(columns, row)) for row in rows]
        return JSONResponse(content=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch complaints: {str(e)}")


@app.post("/create-complaint")
async def create_complaint(complaint: Complaint):
    try:
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO dbo.requests_response (
                tc,
                ad,
                soyad,
                request,
                request_date,
                request_status,
                catagory,
                user_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', complaint.tc, complaint.ad, complaint.soyad, complaint.request, complaint.request_date, complaint.request_status, complaint.catagory, complaint.user_id)
        conn.commit()

        return JSONResponse(content={"message": "Şikayet başarılıyla oluşturuldu, ilgili birime yönlendiriyoruz."}, status_code=201)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='127.0.0.1', port=8002)