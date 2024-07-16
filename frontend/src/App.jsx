import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import KarsilamaEkrani from './Components/KarsilamaEkrani';  
import KullaniciBilgileri from './Components/KullaniciBilgileri';  
import AdminGiris from './Components/AdminGiris';
import Chat from './Components/Chat';
import AdminPanel from './Components/AdminPanel';



const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<KarsilamaEkrani />} />
        <Route path="/kullanici-bilgileri" element={<KullaniciBilgileri />} />
        <Route path="/admin-giris" element={<AdminGiris />} />
        <Route path="/chat" element={<Chat />} />
        <Route path='/admin-paneli' element={<AdminPanel />} />
       
        
      </Routes>
    </Router>
  );
};

export default App;
