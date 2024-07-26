import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Input, message } from 'antd';
import styles from '../CSS/AdminGirisBa.module.css';
import mavi1 from '../Png/mavi1.png';

const AdminGiriBA = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Initialize useNavigate hook

    const onUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const onPasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const onButtonAdminGirisClick = useCallback(async () => {
        if (!username || !password) {
            message.error('Lütfen tüm alanları doldurun.');
            return;
        }

        try {
            // Prepare form data
            const formData = new FormData();
            formData.append('username', username);
            formData.append('password', password);

            const response = await axios.post('http://127.0.0.1:8002/admin/login', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.message === "Login successful") {
                localStorage.setItem('adminUsername', username);
                navigate('/admin-paneli');
                message.success('Giriş başarılı');
            } else {
                message.error('Giriş başarısız. Bilgilerinizi kontrol edin.');
            }
        } catch (error) {
            message.error('Giriş işlemi sırasında bir hata oluştu.');
            console.error('Login error:', error);
        }
    }, [username, password, navigate]);

    return (
        <div className={styles.adminGiriBa} style={{ marginTop: '-90px' }}>
            <div className={styles.groupParent}>
                <div className={styles.eamilIdParent}>
                    <div className={styles.eamilId}>
                        <div className={styles.eamilIdChild} />
                        <div className={styles.denizbankKullancAdnz}>DenizBank Kullanıcı Adınız:</div>
                        <Input 
                            className={styles.ltfenKullancAdnz} 
                            placeholder="Lütfen kullanıcı adınızı girin." 
                            value={username}
                            onChange={onUsernameChange}
                        />
                    </div>
                    <div className={styles.eamilId1}>
                        <div className={styles.eamilIdItem} />
                        <div className={styles.denizbankIfreniz}>DenizBank Şifreniz:</div>
                        <Input 
                            className={styles.ltfenIfreniziGirin} 
                            placeholder="Lütfen şifrenizi girin." 
                            value={password}
                            onChange={onPasswordChange}
                            type="password"
                        />
                    </div>
                </div>
                <Button 
                    className={styles.button} 
                    onClick={onButtonAdminGirisClick}
                >
                    <div className={styles.giriYap}>Giriş Yap</div>
                </Button>
            </div>
            <div className={styles.ltfenPersonelBilgilerinizi}>Lütfen personel bilgilerinizi giriniz.</div>
            <img className={styles.mavi1Icon} alt="" src={mavi1} />
        </div>
    );
};

export default AdminGiriBA;
