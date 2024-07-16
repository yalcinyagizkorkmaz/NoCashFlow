import { FunctionComponent, useCallback, useState } from 'react';
import styles from '../CSS/KullaniciBilgileriBa.module.css';
import mavi1 from '../Png/mavi1.png';
import { Button, Input, Checkbox } from 'antd';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom

const KullancBilgileriBa: FunctionComponent = () => {
  const [checked, setChecked] = useState(false);
  const navigate = useNavigate(); // Initialize navigate from useNavigate

  const onChange = (e) => {
    console.log(`checked = ${e.target.checked}`);
    setChecked(e.target.checked);
  };

  const onButtonSikayetClick = useCallback(() => {
    navigate('/chat'); // Navigate to '/kullanici-bilgileri' route on button click
  }, [navigate]);

  const onButtonContainerClick = useCallback(() => {
    navigate('/admin-giris'); // Navigate to '/admin-giris' route on button click
  }, [navigate]);

  return (
    <div className={styles.kullancBilgileriBa}>
      <div className={styles.groupParent}>
        <div className={styles.eamilIdParent}>
          <div className={styles.eamilId}>
            <div className={styles.eamilIdChild} />
            <div className={styles.adnz}>Adınız:</div>
            <Input className={styles.ltfenAdnzGirin} placeholder="Lütfen adınızı girin." />
          </div>
          <div className={styles.eamilId1}>
            <div className={styles.eamilIdChild} />
            <div className={styles.adnz}>TC no:</div>
            <Input className={styles.ltfen11Haneli} placeholder="Lütfen 11 haneli TC no girin." />
          </div>
          <div className={styles.eamilId2}>
            <div className={styles.eamilIdChild} />
            <div className={styles.adnz}>Soyadınız:</div>
            <Input className={styles.ltfenAdnzGirin} placeholder="Lütfen soyadınızı girin." />
          </div>
          <div className={styles.eamilId3}>
            <div className={styles.eamilIdChild} />
            <div className={styles.adnz}>Telefon No:</div>
            <Input className={styles.ltfenTelefonNumaranz} placeholder="Lütfen telefon numaranızı girin." />
          </div>
        </div>
      
        <Checkbox onChange={onChange} style={{ marginRight: '10px' }}>
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
