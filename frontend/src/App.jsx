import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import KarsilamaEkrani from './Components/KarsilamaEkrani';  
import KullaniciBilgileri from './Components/KullaniciBilgileri';  
import AdminGiris from './Components/AdminGiris';
import Chat from './Components/Chat';
import AdminPanel from './Components/admin_panel';
import SikayetDetay from './Components/SikayetDetay';



const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<KarsilamaEkrani />} />
        <Route path="/kullanici-bilgileri" element={<KullaniciBilgileri />} />
        <Route path="/admin-giris" element={<AdminGiris />} />
        <Route path="/chat" element={<Chat />} />
        <Route path='/admin-paneli' element={<AdminPanel />} />
        <Route path='/sikayet-detay' element={<SikayetDetay />} />
        <Route path='/admin-giris' element={<AdminPanel />} />
        <Route path='/admin-giris' element={<SikayetDetay />} />
      </Routes>
    </Router>
  );
};

export default App;
