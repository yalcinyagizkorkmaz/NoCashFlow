from flask import Flask, request, jsonify
import pyodbc

app = Flask(__name__)

# Set Azure SQL connection string directly in the script
conn_str = 'Driver={ODBC Driver 18 for SQL Server};Server=tcp:ncf.database.windows.net,1433;Database=NCFDB;UID=user2;PWD=Deneme12345;Encrypt=yes;TrustServerCertificate=no;Connection Timeout=30'

# Veritabanı bağlantısı oluşturma
conn = pyodbc.connect(conn_str)

@app.route('/admin_bilgileri', methods=['GET'])
def get_admin_bilgileri():
    try:
        cursor = conn.cursor()
        cursor.execute('SELECT admin_id, kullanici_adi, kullanici_sifre FROM dbo.admin_bilgileri')
        rows = cursor.fetchall()
        columns = [column[0] for column in cursor.description]
        result = []
        for row in rows:
            result.append(dict(zip(columns, row)))
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/kullanici_bilgileri', methoxds=['GET'])
def get_kullanici_bilgileri():
    try:
        cursor = conn.cursor()
        cursor.execute('SELECT user_id, ad, soyad, tc, tel FROM dbo.kullanici_bilgileri')
        rows = cursor.fetchall()
        columns = [column[0] for column in cursor.description]
        result = []
        for row in rows:
            result.append(dict(zip(columns, row)))
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/requests_response', methods=['GET'])
def get_requests_response():
    tc = request.args.get('tc')
    if tc:
        try:
            cursor = conn.cursor()
            cursor.execute('''
                SELECT 
                    id,
                    tc,
                    ad,
                    soyad,
                    request_type,
                    request,
                    request_date,
                    request_status,
                    category
                FROM 
                    dbo.requests_response
                WHERE 
                    tc = ?
            ''', tc)
            rows = cursor.fetchall()
            columns = [column[0] for column in cursor.description]
            result = []
            for row in rows:
                result.append(dict(zip(columns, row)))
            return jsonify(result)
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    else:
        return jsonify({"error": "TC kimlik numarası belirtilmedi."}), 400

if __name__ == '__main__':
    app.run(debug=True)
