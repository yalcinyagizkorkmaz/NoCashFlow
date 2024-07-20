import React, { useEffect, useState,useCallback } from 'react';
import "../CSS/admin_panel.css";
import "../CSS/header.css";
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

const AdminPanel = () => {
    const navigate = useNavigate();
    const onButtonSikayetCikisClick = useCallback(() => {
        navigate('/admin-giris'); // Navigate to '/kullanici-bilgileri' route on button click
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
                    <button className="logout-button" onClick={onButtonSikayetCikisClick} >Çıkış Yap</button>
                </div>
            </div>
            <br></br>
            <div className="title">Şikayetler</div>
            <div className="filter-menu">
            <form>
                <div className="filter-item">
                    <label htmlFor="category-select">Kategori Seçimi:</label>
                    <select id="category-select" value={category} onChange={handleCategoryChange}>
                        <option value="all">Tüm Kategoriler</option>
                        <option value="kategori1">Kategori 1</option>
                        <option value="kategori2">Kategori 2</option>
                        <option value="kategori3">Kategori 3</option>
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
