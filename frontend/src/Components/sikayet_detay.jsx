import React, { useEffect, useState } from 'react';
import "../CSS/admin_panel.css";
import "../CSS/header.css";
import "../CSS/sikayet_detay.css";
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Divider, dtst } from 'antd';
const sikayet_detay = () => {
    return (
        <div>
            <div className="header">

                <div className="logo">
                    <img src="/beyaz.png" alt="logo" />
                </div>
                <div className="header-right">
                    <img src="/Inset.png" alt="divider" className="divider" />
                    <span className="username">Burak Berk Aydın</span>
                    <button className="logout-button" >Çıkış Yap</button>
                </div>
            </div>
            <br></br>
            <div className="content">
                <br></br>
                <h1>Şikayet Detay</h1>
                <br></br>
                <div className="divider2" ></div>
                <br></br>
                <h2>Müşteri Bilgileri</h2>
                <br></br>
                <p>İsim: <strong>Döndü Dönmez</strong></p>
                <p>Telefon Numarası: <strong>05555555555</strong></p>
                <p>TC: <strong>111111111111</strong></p>
                <p>Şikayet Kategorisi: <strong>ATM</strong></p>
                <p>Tarih: <strong>17 Temmuz 2024</strong></p>

                <br></br>
                <div className="divider2" ></div>
                <br></br>
                <h2>Şikayet Metni</h2>
                <br></br>
                <p>18:13:50 tarihinde G2626 atmsinde</p>
                <br></br>
                <div className="divider2" ></div>
                <br></br>
            </div>
            <div className="container">
                <button className="cozuldu">Çözüldü olarak işaretle</button>
                <button className="cozuluyor">Çözülüyor olarak işaretle</button>
            </div>
        </div>
    );
}
export default sikayet_detay;