import React, { useEffect, useState,useCallback } from 'react';
import "../CSS/admin_panel.css";
import "../CSS/header.css";
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

const AdminPanel = () => {
    const navigate = useNavigate();
    const onButtonSikayetCikisClick = useCallback(() => {
        navigate('/admin-giris'); // Navigate to '/kullanici-bilgileri' route on button click
      }, [navigate]);
    
    return (
        <div>
            <div className="header">

                <div className="logo">
                    <img src="/beyaz.png" alt="logo" />
                </div>
                <div className="header-right">
                    <img src="/Inset.png" alt="divider" className="divider" />
                    <span className="username">Burak Berk Aydın</span>
                    <button className="logout-button" onClick={onButtonSikayetCikisClick} >Çıkış Yap</button>
                </div>
            </div>
            <br></br>
            <div className="title">Şikayetler</div>
            <div className="content-table">
                <table class="table">
                    <thead class="thead-dark">
                        <tr>
                            <th scope="col">TC</th>
                            <th scope="col">İSİM</th>
                            <th scope="col">ŞİKAYET</th>
                            <th scope="col">TARİH</th>
                            <th scope="col">KATEGORİ</th>
                            <th scope="col">DURUM</th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>111111111</td>
                            <td>Döndü Dönmez</td>
                            <td>18:13:50 tarihinde G2626 atmsinde</td>
                            <td>15 Temmuz 2024</td>
                            <td>ATM</td>
                            <td>Çözüldü</td>
                            <td>
                                <button className="incele-button" onClick={()=>navigate("/sikayet-detay")}>İncele</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
           
        </div>
    );
};
export default AdminPanel;
