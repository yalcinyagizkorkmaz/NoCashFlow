import React, { FunctionComponent, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../CSS/admin_panel.css";
import "../CSS/header.css";

// Helper function to get a random status
const getRandomStatus = () => {
    const statuses = ['Open', 'In Progress', 'Closed'];
    const randomIndex = Math.floor(Math.random() * statuses.length);
    return statuses[randomIndex];
};

// Helper function to sort complaints by date
const sortComplaintsByDate = (complaints: any[], order: string) => {
    return complaints.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return order === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
    });
};

const AdminPanel: FunctionComponent = () => {
    
    
    
    const navigate = useNavigate();
    const onButtonSikayetCikisClick = useCallback(() => {
        navigate('/admin-giris');
    }, [navigate]);
   
    const handleIncelemeChange = (id) => {
        const complaint = complaints.find(complaint => complaint.id === id);
        if (complaint) {
            navigate('/sikayet-detay', { state: { complaint } });
        } else {
            console.error('Complaint not found:', id);
        }
    };

    const [category, setCategory] = useState('all');
    const [isSortDropdownVisible, setIsSortDropdownVisible] = useState(false);
    const [sortOrder, setSortOrder] = useState('desc'); // Default sorting order
    const [shouldSort, setShouldSort] = useState(false); // New state to control sorting

    const [currentPage, setCurrentPage] = useState(1);
    const complaintsPerPage = 10;

    const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setCategory(event.target.value);
        setCurrentPage(1); // Reset to the first page when the category changes
    };

    const handleReset = () => {
        setCategory('all');
        setCurrentPage(1); // Reset to the first page when resetting
    };

    const handleSort = (order: string) => {
        setSortOrder(order);
        setShouldSort(true); // Enable sorting
        setIsSortDropdownVisible(false);
    };

    const toggleSortDropdown = () => {
        setIsSortDropdownVisible(!isSortDropdownVisible);
    };

    // Initialize complaints with random statuses
    const [complaints, setComplaints] = useState(() => [
        {id:1, tc: '12345678901', name: 'Ali Veli', phone: '05326252838', complaintText: 'Hesap blokeli, işlemlerimi yapamıyorum.', date: '2024-07-21', category: 'Hesap/Kart Bloke Kaldırma', status: getRandomStatus() },
        {id:2,tc: '09876543210', name: 'Ayşe Yılmaz', phone: '05551234567', complaintText: 'Kartımın limit artırımı yapılmadı.', date: '2024-07-20', category: 'Bireysel Kredi Kartları', status: getRandomStatus() },
        {id:3 ,tc: '11223344556', name: 'Mehmet Öz', phone: '05443322119', complaintText: 'Mobil uygulama giriş sorunları yaşıyorum.', date: '2024-07-19', category: 'Mobil Deniz', status: getRandomStatus() },
        {id:4 ,tc: '22334455667', name: 'Zeynep Korkmaz', phone: '05312345678', complaintText: 'Yanlış işlem ücretleri yansıtıldı.', date: '2024-07-18', category: 'Para Transferi', status: getRandomStatus() },
        {id:5 ,tc: '33445566778', name: 'Kemal Yalçın', phone: '05432198765', complaintText: 'Yatırım hesabım güncellenmedi.', date: '2024-07-17', category: 'Yatırım İşlemleri', status: getRandomStatus() },
        // Additional complaints for testing
        {id:6 ,tc: '44556677889', name: 'Fatma Yurt', phone: '05553211223', complaintText: 'Mobil uygulamada sürekli hata alıyorum.', date: '2024-07-16', category: 'Mobil Deniz', status: getRandomStatus() },
        {id:7 ,tc: '55667788990', name: 'Ahmet Kara', phone: '05443210987', complaintText: 'Kredi kartı ekstresi eksik.', date: '2024-07-15', category: 'Bireysel Kredi Kartları', status: getRandomStatus() },
        {id:8 ,tc: '66778899001', name: 'Elif Yılmaz', phone: '05332145678', complaintText: 'Yanlış işlem yapıldı.', date: '2024-07-14', category: 'Para Transferi', status: getRandomStatus() },
        {id:9 ,tc: '77889900112', name: 'Burak Çelik', phone: '05432123456', complaintText: 'Hesap blokesi kaldırılmadı.', date: '2024-07-13', category: 'Hesap/Kart Bloke Kaldırma', status: getRandomStatus() },
        {id:10 ,tc: '88990011223', name: 'Seda Kaya', phone: '05554321098', complaintText: 'Eft işlemim iptal edilmedi.', date: '2024-07-12', category: 'EFT/Havale Teyit', status: getRandomStatus() },
        {id:11 ,tc: '99001122334', name: 'Cemil Demir', phone: '05345678901', complaintText: 'Yanlış hesap bilgileri.', date: '2024-07-11', category: 'Bilgi/Belge Sahtecilik / Kayıp', status: getRandomStatus() },
        {id:12 ,tc: '00112233445', name: 'Ayşe Karaca', phone: '05456789012', complaintText: 'Konut sigortası hakkında bilgi eksik.', date: '2024-07-10', category: 'Konut Sigortası', status: getRandomStatus() },
        {id:13 ,tc: '11223344556', name: 'Mehmet Özer', phone: '05367890123', complaintText: 'Yatırım hesabımın dökümanları kayboldu.', date: '2024-07-09', category: 'Yatırım İşlemleri', status: getRandomStatus() },
        {id:14 ,tc: '22334455667', name: 'Gülşah Çelik', phone: '05567890123', complaintText: 'Bilgi sahtecilik şüphesi.', date: '2024-07-08', category: 'Bilgi/Belge Sahtecilik / Kayıp', status: getRandomStatus() },
        {id:15, tc: '33445566778', name: 'Ege Yurt', phone: '05467890123', complaintText: 'Eft işlemi onaylanmadı.', date: '2024-07-07', category: 'EFT/Havale Teyit', status: getRandomStatus() },
        {id:16 ,tc: '44556677889', name: 'Aylin Demir', phone: '05378901234', complaintText: 'Kartım kayboldu.', date: '2024-07-06', category: 'Bilgi/Belge Sahtecilik / Kayıp', status: getRandomStatus() },
        {id:17 ,tc: '55667788990', name: 'Kadir Kaplan', phone: '05567890123', complaintText: 'Etkileşim Merkezi ile ilgili sorun.', date: '2024-07-05', category: 'İletişim Merkezi', status: getRandomStatus() }
        // Add more complaints here as needed
    ]);

    const handleStatusChange = (index: number, newStatus: string) => {
        setComplaints(prevComplaints => {
            const updatedComplaints = [...prevComplaints];
            const complaint = updatedComplaints[index];
            
            // Prevent setting status to 'Çözülmedi' again if already changed
            if (complaint.status === 'Çözülmedi' && newStatus !== 'Çözülmedi') {
                complaint.status = newStatus;
            } else if (complaint.status !== 'Çözülmedi') {
                complaint.status = newStatus;
            }
            
            return updatedComplaints;
        });
    };
    

    // Filter complaints based on selected category
    const filteredComplaints = complaints.filter(complaint => 
        category === 'all' || complaint.category === category
    );

    // Sort complaints based on selected sort order only if shouldSort is true
    const sortedComplaints = shouldSort ? sortComplaintsByDate(filteredComplaints, sortOrder) : filteredComplaints;

    // Pagination logic
    const indexOfLastComplaint = currentPage * complaintsPerPage;
    const indexOfFirstComplaint = indexOfLastComplaint - complaintsPerPage;
    const currentComplaints = sortedComplaints.slice(indexOfFirstComplaint, indexOfLastComplaint);

    const totalPages = Math.ceil(sortedComplaints.length / complaintsPerPage);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    // Retrieve the username from localStorage
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
                            <option value="Mobil Deniz">Mobil Deniz</option>
                            <option value="Bireysel Kredi Kartları">Bireysel Kredi Kartları</option>
                            <option value="Debit Kartlar">Debit Kartlar</option>
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
                            <th>İsim</th>
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
                                <td>{complaint.phone}</td>
                                <td>{complaint.name}</td>
                                <td>{complaint.complaintText}</td>
                                <td>{complaint.date}</td>
                                <td>{complaint.category}</td>
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
            className={`status-button ${complaint.status === 'In Progress' ? 'active' : ''}`} 
            disabled={complaint.status === 'Çözülmedi'}
            onClick={() => handleStatusChange(index, 'In Progress')}
        >
            Çözülüyor
        </button>
        <button 
            className={`status-button ${complaint.status === 'Closed' ? 'active' : ''}`} 
            disabled={complaint.status === 'Çözülmedi'}
            onClick={() => handleStatusChange(index, 'Closed')}
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
