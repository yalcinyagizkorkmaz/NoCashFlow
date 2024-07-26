import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ComplaintsAdminPage = () => {
    const [complaints, setComplaints] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        axios.get('http://127.0.0.1:8002/requests_response_sorted/recent_to_old')
            .then(response => {
                setComplaints(response.data);
            })
            .catch(error => {
                setError('Failed to fetch complaints.');
                console.error('Fetching complaints failed:', error);
            });
    }, []);

    const updateComplaintStatus = (id, newStatus) => {
        axios.put(`http://127.0.0.1:8002/requests_response/${id}/status`, { status: newStatus })
            .then(response => {
                const updatedComplaints = complaints.map(complaint =>
                    complaint.id === id ? { ...complaint, request_status: newStatus } : complaint
                );
                setComplaints(updatedComplaints);
                alert('Status updated successfully!');
            })
            .catch(error => {
                alert('Failed to update status.');
                console.error('Updating status failed:', error);
            });
    };

    const dashboardStyle = {
        maxWidth: '800px',
        margin: '20px auto',
        padding: '20px',
        backgroundColor: '#fff',
        border: '1px solid #ccc',
        borderRadius: '10px'
    };

    const headingStyle = {
        textAlign: 'center',
        color: '#333',
        marginBottom: '20px'
    };

    const errorStyle = {
        color: 'red',
        textAlign: 'center'
    };

    const complaintListStyle = {
        display: 'flex',
        flexDirection: 'column'
    };

    const complaintCardStyle = {
        padding: '10px',
        marginBottom: '10px',
        backgroundColor: '#f0f0f0',
        borderRadius: '8px'
    };

    const paragraphStyle = {
        margin: '5px 0',
        color: '#333'
    };

    const actionButtonStyle = {
        padding: '5px 10px',
        marginRight: '5px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
    };

    return (
        <div style={dashboardStyle}>
            <h1 style={headingStyle}>Şikayet Detayları</h1>
            {error && <p style={errorStyle}>{error}</p>}
            <div style={complaintListStyle}>
                {complaints.map(complaint => (
                    <div key={complaint.id} style={complaintCardStyle}>
                        <p style={paragraphStyle}><strong>İsim:</strong> {complaint.ad} {complaint.soyad}</p>
                        <p style={paragraphStyle}><strong>Şikayet:</strong> {complaint.request}</p>
                        <p style={paragraphStyle}><strong>Durum:</strong> {complaint.request_status}</p>
                        <div className="actions">
                            <button style={actionButtonStyle} onClick={() => updateComplaintStatus(complaint.id, 'Çözüldü')}>Çözüldü Olarak İşaretle</button>
                            <button style={actionButtonStyle} onClick={() => updateComplaintStatus(complaint.id, 'Çözülüyor')}>Çözülüyor Olarak İşaretle</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ComplaintsAdminPage;
