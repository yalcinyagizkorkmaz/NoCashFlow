import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; 
import styles from '../CSS/KarlamaBa.module.css';
import beyaz from '../Png/beyaz.png';
import Rectangle1 from '../Png/Rectangle1.png';
import Rectangle3 from '../Png/Rectangle3.png';
import { Button } from 'antd';

const KarsilamaEkrani = () => {
  const navigate = useNavigate();  

  const onCTAContainerClick = useCallback(() => {
    navigate('/kullanici-bilgileri');  
  }, [navigate]);

  return (
    <div className={styles.karlamaBa}>
      <img className={styles.rectangleIcon} alt="" src={Rectangle1} />
      <img className={styles.karlamaBaItem} alt="" src={Rectangle3} />
      <div className={styles.header}>
        <div className={styles.content}>
          <div className={styles.herGeriBildiriminiz}>Her geri bildiriminiz bizim için çok değerli.</div>
          <div className={styles.imdiDenizbanknYapay}>
            Şimdi DenizBank’ın yapay zeka destekli şikayet sistemi ile şikayetlerinizi bize iletin, hızlıca çözelim!
          </div>
        </div>
        <Button className={styles.button} onClick={onCTAContainerClick}>
          <div className={styles.ikayetOlutur}>Şikayet Oluştur</div>
        </Button>
      </div>
      <img className={styles.beyaz1Icon} alt="" src={beyaz} />
    </div>
  );
};

export default KarsilamaEkrani;
