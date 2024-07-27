import { FunctionComponent, useCallback, useState } from 'react';
import styles from '../CSS/KullaniciBilgileriBa.module.css';
import mavi1 from '../Png/mavi1.png';
import { Button, Input, Checkbox, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const KullancBilgileriBa: FunctionComponent = () => {
    const navigate = useNavigate();
    const [ad, setAd] = useState('');
    const [soyad, setSoyad] = useState('');
    const [tc, setTc] = useState('');
    const [tel, setTel] = useState('');
    const [checked, setChecked] = useState(false);

    const onChange = (e) => {
        setChecked(e.target.checked);
    };

    const onAdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAd(e.target.value);
    };

    const onSoyadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSoyad(e.target.value);
    };

    const onTcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTc(e.target.value);
    };

    const onTelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTel(e.target.value);
    };

    const onButtonSikayetClick = useCallback(() => {
        if (!ad || !soyad || !tc || !tel || !checked) {
            message.error('Lütfen tüm alanları doldurun.');
        } else {
            const userInfo = { ad, soyad, tc, tel };
            console.log('User info to be sent:', userInfo); // Log the user info before sending

            axios.post('http://127.0.0.1:8000/kullanici_bilgileri', userInfo)
                .then(response => {
                    const createdUser = response.data;
                    console.log('Response from server:', createdUser); // Log the response data
                    localStorage.setItem('userInfo', JSON.stringify(createdUser)); // Store user info locally
                    console.log('User info set in localStorage:', JSON.stringify(createdUser)); // Log the user info set in localStorage
                    navigate('/chat');
                })
                .catch(error => {
                    message.error('Kullanıcı oluşturulamadı. Lütfen tekrar deneyin.');
                    console.error('Error creating user:', error);
                });
        }
    }, [ad, soyad, tc, tel, checked, navigate]);

    const onButtonContainerClick = useCallback(() => {
        navigate('/admin-giris');
    }, [navigate]);

    return (
        <div className={styles.kullancBilgileriBa}>
            <div className={styles.groupParent}>
                <div className={styles.eamilIdParent}>
                    <div className={styles.eamilId}>
                        <div className={styles.eamilIdChild} />
                        <div className={styles.adnz}>Adınız:</div>
                        <Input className={styles.ltfenAdnzGirin} value={ad} onChange={onAdChange} placeholder="Lütfen adınızı girin." />
                    </div>
                    <div className={styles.eamilId1}>
                        <div className={styles.eamilIdChild} />
                        <div className={styles.adnz}>TC no:</div>
                        <Input className={styles.ltfen11Haneli} value={tc} onChange={onTcChange} placeholder="Lütfen 11 haneli TC no girin." />
                    </div>
                    <div className={styles.eamilId2}>
                        <div className={styles.eamilIdChild} />
                        <div className={styles.adnz}>Soyadınız:</div>
                        <Input className={styles.ltfenAdnzGirin} value={soyad} onChange={onSoyadChange} placeholder="Lütfen soyadınızı girin." />
                    </div>
                    <div className={styles.eamilId3}>
                        <div className={styles.eamilIdChild} />
                        <div className={styles.adnz}>Telefon No:</div>
                        <Input className={styles.ltfenTelefonNumaranz} value={tel} onChange={onTelChange} placeholder="Lütfen telefon numaranızı girin." />
                    </div>
                </div>

                <Checkbox onChange={onChange} value={checked} style={{ marginRight: '10px' }}>
                    <div className={styles.denizbankaVermiOlduum}>
                        DenizBank’a vermiş olduğum özel nitelikli kişisel verilerin şikayetimin çözümlenmesi amacıyla{" "}
                        işlenmesine izin veriyorum.
                    </div>
                </Checkbox>
                <div style={{ textAlign: 'center', marginTop: '-17px' }}>
                    <Button className={styles.button} onClick={onButtonSikayetClick}>
                        <div className={styles.ikayetOlutur}>Şikayet Oluştur</div>
                    </Button>
                </div>
            </div>
            <Button className={styles.button1} onClick={onButtonContainerClick}>
                <div className={styles.denizbankAlanym}>DenizBank çalışanıyım</div>
            </Button>
            <div className={styles.groupContainer}>
                <div className={styles.ltfenBilgileriniziGirinizParent}>
                    <div className={styles.ltfenBilgileriniziGiriniz}>Lütfen bilgilerinizi giriniz.</div>
                    <div className={styles.dummyLogo} />
                </div>
                <img className={styles.mavi1Icon} alt="" src={mavi1} />
            </div>
        </div>
    );
};

export default KullancBilgileriBa;
