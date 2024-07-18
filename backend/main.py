from fastapi import FastAPI, HTTPException, Query, Body
from fastapi.responses import JSONResponse
import pyodbc
import os
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm

app = FastAPI()

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

@app.get("/requests_response")
async def get_requests_response(tc: str = Query(None)):
    if tc:
        try:
            cursor = conn.cursor()
            cursor.execute('''
                SELECT
                    id,
                    user_id
                    tc,
                    ad,
                    soyad,
                    request,
                    request_date,
                    request_status,
                    catagory
                FROM
                    dbo.requests_response
                WHERE
                    tc = ?
            ''', tc)
            rows = cursor.fetchall()
            columns = [column[0] for column in cursor.description]
            result = [dict(zip(columns, row)) for row in rows]
            return JSONResponse(content=result)
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    else:
        raise HTTPException(status_code=400, detail="TC kimlik numarası belirtilmedi.")

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='127.0.0.1', port=8002)
