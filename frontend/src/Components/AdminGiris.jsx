import { FunctionComponent, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, message } from 'antd'; // Import Input and message from Ant Design
import styles from '../CSS/AdminGirisBa.module.css';
import mavi1 from '../Png/mavi1.png';

const AdminGiriBA: FunctionComponent = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Initialize useNavigate hook

    const onUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    };

    const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const onButtonAdminGirisClick = useCallback(() => {
        if (!username || !password) {
            message.error('Lütfen tüm alanları doldurun.');
        } else {
            // Store the username in localStorage
            localStorage.setItem('adminUsername', username);
            console.log("Admin giriş Yapıldı!");
            navigate('/admin-paneli');
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
