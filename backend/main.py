from fastapi import FastAPI, HTTPException, Query
from fastapi.responses import JSONResponse
import pyodbc
import os

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
        cursor.execute('SELECT admin_id, kullanici_adi, kullanici_sifre FROM dbo.admin_bilgileri')
        rows = cursor.fetchall()
        columns = [column[0] for column in cursor.description]
        result = [dict(zip(columns, row)) for row in rows]
        return JSONResponse(content=result)
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
    uvicorn.run(app, host='127.0.0.2', port=8001)