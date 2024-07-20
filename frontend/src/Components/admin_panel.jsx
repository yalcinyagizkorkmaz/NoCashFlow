import React, { useCallback, useState } from 'react';
import "../CSS/admin_panel.css";
import "../CSS/header.css";
import filtericon from "../Png/filtericon.svg";
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
    const navigate = useNavigate();
    const onButtonSikayetCikisClick = useCallback(() => {
        navigate('/admin-giris');
    }, [navigate]);

    const [category, setCategory] = useState('all');
    const handleCategoryChange = (event) => {
        setCategory(event.target.value);
    };

    const handleReset = () => {
        setCategory('all');
    };

    const handleSort = () => {
        // Sıralama işlemleri burada yapılabilir
        console.log('Sıralama işlemi gerçekleştirildi');
    };

    return (
        <div>
            <div className="header">
                <div className="logo">
                    <img src="/beyaz.png" alt="logo" />
                </div>
                <div className="header-right">
                    <img src="/Inset.png" alt="divider" className="divider" />
                    <span className="username">Burak Berk Aydın</span>
                    <button className="logout-button" onClick={onButtonSikayetCikisClick}>Çıkış Yap</button>
                </div>
            </div>
            <br />
            <div className="title">Şikayetler</div>
            <div className="filter-menu">
                <form>
                    <div className="filter-item">
                    <svg width="60px" height="60px" viewBox="0 0 52 61" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g id="Filter icon">
                                <path id="Line" opacity="0.686151" d="M50.6119 60.092V1" stroke="white" stroke-width="0.2" stroke-linecap="square"/>
                                <g id="filter">
                                    <path id="Oval" fill-rule="evenodd" clip-rule="evenodd" d="M12.0265 28.6466C18.0489 28.6466 22.9311 26.9458 22.9311 24.8478C22.9311 22.7498 18.0489 21.0491 12.0265 21.0491C6.004 21.0491 1.12183 22.7498 1.12183 24.8478C1.12183 26.9458 6.004 28.6466 12.0265 28.6466Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path id="Path" d="M1.12183 24.8479C1.12466 28.6597 4.59581 31.971 9.51001 32.8498V38.1436C9.51001 39.1926 10.6367 40.043 12.0265 40.043C13.4163 40.043 14.5429 39.1926 14.5429 38.1436V32.8498C19.4571 31.971 22.9283 28.6597 22.9311 24.8479" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </g>
                            </g>
                        </svg>
                        <select id="category-select" value={category} onChange={handleCategoryChange}>
                            <option value="all">Tüm Kategoriler</option>
                            <option value="mobilDeniz">Mobil Deniz</option>
                            <option value="bireyselKrediKartlari">Bireysel Kredi Kartları</option>
                            <option value="debitKartlar">Debit Kartlar</option>
                            <option value="yatirimİslemleri">Yatırım İşlemleri</option>
                            <option value="paraTransferi">Para Transferi</option>
                            <option value="vadeliMevduat">Vadeli Mevduat</option>
                            <option value="hesap/kartBlokeKaldirma">Hesap/Kart Bloke Kaldırma</option>
                            <option value="dolandiricilikBilgisiDisindaİslem">Dolandırıcılık-Bilgisi Dış. Şüph. Hesap-Kart İşl.</option>
                            <option value="bilgiBelgeSahtecilikKayip">Bilgi/Belge Sahtecilik/Kayıp</option>
                            <option value="konutSigortasi">Konut Sigortası</option>
                            <option value="bireyselKrediHayatSigortasi">Bireysel Kredi Hayat Sigortası</option>
                            <option value="iletisimMerkezi">İletişim Merkezi</option>
                        </select>
                    </div>
                    <div className="filter-item">
                        <button type="button" onClick={handleReset}>Filtreyi Sıfırla</button>
                    </div>
                    <div className="filter-item">
                        <button type="button" onClick={handleSort}>Sırala</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminPanel;