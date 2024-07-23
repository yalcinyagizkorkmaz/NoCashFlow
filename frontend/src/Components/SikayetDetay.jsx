import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../CSS/sikayet_detay.css";

const Sikayet_detay = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const complaint = location.state?.complaint;

    const onButtonSikayetDetayCikisClick = () => {
        navigate('/admin-giris'); // Navigate to '/admin-giris' route on button click
    };

    const updateComplaintStatus = async (status) => {
        try {
            const response = await axios.put(`/requests_response/${complaint.id}/status`, { status });
            if (response.status === 200) {
                navigate('/admin-panel'); // Navigate to '/admin-panel' route on success
            } else {
                console.error('Failed to update complaint status:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Error updating complaint status:', error);
        }
    };
    

    const onMarkAsResolvedClick = () => {
        updateComplaintStatus('Çözüldü');
    };

    const onMarkAsResolvingClick = () => {
        updateComplaintStatus('Çözülüyor');
    };

    if (!complaint) {
        return <div>Complaint details not found.</div>;
    }

    return (
        <div>
            <div className="header">
                <div className="logo">
                    <img src="/beyaz.png" alt="logo" />
                </div>
                <div className="header-right">
                    <img src="/Inset.png" alt="divider" className="divider" />
                    <span className="username">{localStorage.getItem('adminUsername') || 'Admin'}</span>
                    <button className="logout-button" onClick={onButtonSikayetDetayCikisClick}>Çıkış Yap</button>
                </div>
            </div>
            <br />
            <div className="content">
                <br />
                <h1>Şikayet Detay</h1>
                <br />
                <div className="divider2"></div>
                <br />
                <h2>Müşteri Bilgileri</h2>
                <br />
                <p>İsim: <strong>{complaint.name}</strong></p>
                <p>Telefon Numarası: <strong>{complaint.phone}</strong></p>
                <p>TC: <strong>{complaint.tc}</strong></p>
                <p>Şikayet Kategorisi: <strong>{complaint.category}</strong></p>
                <p>Tarih: <strong>{complaint.date}</strong></p>
                <br />
                <div className="divider2"></div>
                <br />
                <h2>Şikayet Metni</h2>
                <br />
                <p>{complaint.complaintText}</p>
                <br />
                <div className="divider2"></div>
                <br />
            </div>
            <div className="container">
                <button className="cozuldu" onClick={onMarkAsResolvedClick}>Çözüldü olarak işaretle</button>
                <button className="cozuluyor" onClick={onMarkAsResolvingClick}>Çözülüyor olarak işaretle</button>
            </div>
        </div>
    );
};

export default Sikayet_detay;
