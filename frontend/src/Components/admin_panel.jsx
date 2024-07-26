import React, { useEffect, useState, FunctionComponent, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "../CSS/admin_panel.css";
import "../CSS/header.css";

const AdminPanel: FunctionComponent = () => {
    const navigate = useNavigate();
    const [complaints, setComplaints] = useState([]);
    const [category, setCategory] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [error, setError] = useState('');
    const [sortOrder, setSortOrder] = useState('desc'); // Default sorting order
    const [isSortDropdownVisible, setIsSortDropdownVisible] = useState(false);
    const complaintsPerPage = 10;

    useEffect(() => {
        const fetchUrl = category === 'all'
            ? 'http://127.0.0.1:8002/requests_response_sorted/recent_to_old'
            : `http://127.0.0.1:8002/requests_response/by_category?category=${category}`;
        
        axios.get(fetchUrl)
            .then(response => {
                setComplaints(response.data);
                setCurrentPage(1); // Reset to the first page after new data is fetched
            })
            .catch(error => {
                setError('Error fetching complaints: ' + error.message);
                console.error('Error fetching complaints:', error);
            });
    }, [category]);

    const onButtonSikayetCikisClick = useCallback(() => {
        navigate('/admin-giris');
    }, [navigate]);

    const handleIncelemeChange = (id) => {
        const complaint = complaints.find(complaint => complaint.id === id);
        if (complaint) {
            navigate('/sikayet-detay', { state: { complaint } });
        }
    };

    const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setCategory(event.target.value);
        setCurrentPage(1); // Reset to the first page when the category changes
    };

    const handleReset = () => {
        setCategory('all');
        setCurrentPage(1);
    };

    const handleSort = (order: string) => {
        setSortOrder(order);
        setIsSortDropdownVisible(false);
    };

    const toggleSortDropdown = () => {
        setIsSortDropdownVisible(!isSortDropdownVisible);
    };

    const handleStatusChange = (index: number, newStatus: string) => {
        const updatedComplaints = [...complaints];
        const complaint = updatedComplaints[index];
        complaint.request_status = newStatus; // assuming request_status is the property name
        setComplaints(updatedComplaints);
    };

    const filteredComplaints = complaints.filter(complaint => category === 'all' || complaint.category === category);

    const sortedComplaints = filteredComplaints.sort((a, b) => {
        return sortOrder === 'asc' ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date);
    });

    const indexOfLastComplaint = currentPage * complaintsPerPage;
    const indexOfFirstComplaint = indexOfLastComplaint - complaintsPerPage;
    const currentComplaints = sortedComplaints.slice(indexOfFirstComplaint, indexOfLastComplaint);
    const totalPages = Math.ceil(sortedComplaints.length / complaintsPerPage);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const adminUsername = localStorage.getItem('adminUsername') || 'Admin';


    return (
        <div>
            <div className="header">
                <div className="logo">
                    <img src="/beyaz.png" alt="logo" />
                </div>
                <div className="header-right">
                    <img src="/Inset.png" alt="divider" className="divider" />
                    <span className="username">{adminUsername}</span>
                    <button className="logout-button" onClick={onButtonSikayetCikisClick}>Çıkış Yap</button>
                </div>
            </div>
            <br />
            <div className="title">Şikayetler</div>
            <div className="filter-menu">
                <form>
                    <div className="filter-item">
                        <svg width="70px" height="60px" viewBox="0 0 52 61" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g id="Filter icon">
                                <path id="Line" opacity="0.686151" d="M50.6119 60.092V1" stroke="white" strokeWidth="0.2" strokeLinecap="square"/>
                                <g id="filter">
                                    <path id="Oval" fillRule="evenodd" clipRule="evenodd" d="M12.0265 28.6466C18.0489 28.6466 22.9311 26.9458 22.9311 24.8478C22.9311 22.7498 18.0489 21.0491 12.0265 21.0491C6.004 21.0491 1.12183 22.7498 1.12183 24.8478C1.12183 26.9458 6.004 28.6466 12.0265 28.6466Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path id="Path" d="M1.12183 24.8479C1.12466 28.6597 4.59581 31.971 9.51001 32.8498V38.1436C9.51001 39.1926 10.6367 40.043 12.0265 40.043C13.4163 40.043 14.5429 39.1926 14.5429 38.1436V32.8498C19.4571 31.971 22.9283 28.6597 22.9311 24.8479" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </g>
                            </g>
                        </svg>
                        <select id="category-select" value={category} onChange={handleCategoryChange} className='select-category'>
                            <option value="all">Tüm Kategoriler</option>
                            <option value="Mobil Deniz">MobilDeniz</option>
                            <option value="Bireysel Kredi Kartları">Bireysel Kredi Kartları</option>
                            <option value="Debit Kartlar">Debit Kartlar</option>
                            <option value="ATM">ATM</option>
                            <option value="İnternet Bankacılığı">ATM</option>
                            <option value="Yatırım İşlemleri">Yatırım İşlemleri</option>
                            <option value="Para Transferi">Para Transferi</option>
                            <option value="Vadeli Mevduat">Vadeli Mevduat</option>
                            <option value="Hesap/Kart Bloke Kaldırma">Hesap/Kart Bloke Kaldırma</option>
                            <option value="Dolandırıcılık-Bilgisi Dışında Şüpheli Hesap / Kart İşlemleri">Dolandırıcılık-Bilgisi Dışında Şüpheli Hesap / Kart İşlemleri</option>
                            <option value="Bilgi/Belge Sahtecilik / Kayıp">Bilgi/Belge Sahtecilik / Kayıp</option>
                            <option value="Konut Sigortası">Konut Sigortası</option>
                            <option value="Bireysel Kredi Hayat Sigortası">Bireysel Kredi Hayat Sigortası</option>
                            <option value="İletişim Merkezi">İletişim Merkezi</option>
                        </select>
                    </div>
                    <div className="filter-item">
                        <svg width="35" height="34" viewBox="0 0 21 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g id="ic-replay-24px">
                                <path id="Path" d="M10.066 4.00981V1.47729L5.87192 4.64294L10.066 7.80858V5.27607C12.8425 5.27607 15.0989 6.97918 15.0989 9.07484C15.0989 11.1705 12.8425 12.8736 10.066 12.8736C7.28953 12.8736 5.03311 11.1705 5.03311 9.07484H3.35547C3.35547 11.8733 6.35844 14.1399 10.066 14.1399C13.7736 14.1399 16.7766 11.8733 16.7766 9.07484C16.7766 6.27641 13.7736 4.00981 10.066 4.00981Z" fill="white"/>
                            </g>
                        </svg>
                        <button type="button" onClick={handleReset}>Filtreyi Sıfırla</button>
                    </div>
                  
                </form>
            </div>
         
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>TC</th>
                            <th>Telefon</th>
                            <th>Ad</th>
                            <th>Soyad</th>
                            <th>Şikayet</th>
                            <th>Tarih</th>
                            <th>Kategori</th>
                            <th>Durum</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentComplaints.map((complaint, index) => (
                            <tr key={index}>
                                <td>{complaint.tc}</td>
                                <td>{complaint.tel}</td>
                                <td>{complaint.ad}</td>
                                <td>{complaint.soyad}</td>
                                <td>{complaint.request}</td>
                                <td>{complaint.request_date}</td>
                                <td>{complaint.catagory}</td>
                                <td>
    <div className="status-buttons">
        <button 
            className={`status-button unresolved-button ${complaint.status === 'Çözülmedi' ? 'active' : ''}`} 
            disabled={complaint.status === 'Çözülmedi'}
            onClick={() => handleStatusChange(index, 'Çözülmedi')}
        >
            Çözülmedi
        </button>
        <button 
            className={`status-button ${complaint.status === 'Çözülüyor' ? 'active' : ''}`} 
            disabled={complaint.status === 'Çözülmedi'}
            onClick={() => handleStatusChange(index, 'Çözülüyor')}
        >
            Çözülüyor
        </button>
        <button 
            className={`status-button ${complaint.status === 'Çözüldü' ? 'active' : ''}`} 
            disabled={complaint.status === 'Çözülmedi'}
            onClick={() => handleStatusChange(index, 'Çözüldü')}
        >
            Çözüldü
        </button>
        <button className='inceleme-button' onClick={() => handleIncelemeChange(complaint.id)}>İnceleme</button>
    </div>
</td>


                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

           <div className="pagination">
                <button 
                    onClick={() => handlePageChange(currentPage - 1)} 
                    disabled={currentPage === 1}
                    className="pagination-button"
                >
                    &lt; {/* Previous arrow */}
                </button>
                {Array.from({ length: totalPages }, (_, index) => (
                    <button 
                        key={index + 1} 
                        onClick={() => handlePageChange(index + 1)} 
                        className={`pagination-button ${currentPage === index + 1 ? 'active' : ''}`}
                    >
                        {index + 1}
                    </button>
                ))}
                <button 
                    onClick={() => handlePageChange(currentPage + 1)} 
                    disabled={currentPage === totalPages}
                    className="pagination-button"
                >
                    &gt; {/* Next arrow */}
                </button>
            </div>
        </div>
    );
};

export default AdminPanel;