import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../CSS/sikayet_detay.css";

const Sikayet_detay = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { complaint: initialComplaint } = location.state;
    const [complaint, setComplaint] = useState(initialComplaint); // Maintain complaint in local state

    const onButtonSikayetDetayCikisClick = () => navigate('/admin-giris');

    const updateComplaintStatus = async (newStatus) => {
        try {
            const response = await axios.put(`http://127.0.0.1:8000/requests_response/${complaint.id}/status`, { status: newStatus });
            if (response.status === 200) {
                alert('Status updated successfully!');
                setComplaint({ ...complaint, request_status: newStatus });  // Update local state
                // Navigate back to the admin panel with updated data
                navigate('/admin-paneli', { replace: true }); // Use 'replace: true' to replace the current entry in the history stack
            } else {
                alert('Failed to update status.');
            }
        } catch (error) {
            alert(`Error updating complaint status: ${error.response ? error.response.data.detail : error.message}`);
            console.error('Error updating complaint status:', error);
        }
    };
    

    const onMarkAsResolvedClick = () => updateComplaintStatus('Çözüldü');
    const onMarkAsResolvingClick = () => updateComplaintStatus('Çözülüyor');

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
                <p>Ad: <strong>{complaint.ad}</strong></p>
                <p>Soyad: <strong>{complaint.soyad}</strong></p>
                <p>Telefon Numarası: <strong>{complaint.tel}</strong></p>
                <p>TC: <strong>{complaint.tc}</strong></p>
                <p>Şikayet Kategorisi: <strong>{complaint.catagory}</strong></p>
                <p>Tarih: <strong>{complaint.request_date}</strong></p>
                <br />
                <div className="divider2"></div>
                <br />
                <h2>Şikayet Metni</h2>
                <br />
                <p>{complaint.request}</p>
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

