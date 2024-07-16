import { FunctionComponent, useCallback } from 'react';
import styles from '../CSS/AdminPanel.module.css';
import beyaz2 from '../Png/beyaz2.png';
import filtericon from '../Png/filtericon.svg';
import sıralaiconu from '../Png/sıralaiconu.svg';
import replay from '../Png/replay.svg';

const AdminPanel: FunctionComponent = () => {

  const onButtonContainerClick = useCallback(() => {
    // Add your code here
  }, []);

  return (
    <div className={styles.adminBa}>
      <div className={styles.header}>
        <div className={styles.buttonParent}>
          <div className={styles.button} onClick={onButtonContainerClick}>
            <div className={styles.kYap}>Çıkış Yap</div>
          </div>
          <div className={styles.burakBerkAydn}>Burak Berk Aydın</div>
        </div>
        <div className={styles.verticalinsetWrapper}>
          <div className={styles.verticalinset}>
            <div className={styles.divider} />
          </div>
        </div>
        <img className={styles.beyaz2Icon} alt="" src={beyaz2} />
      </div>
      <div className={styles.ikayetler}>Şikayetler</div>
      <div className={styles.filter}>
        <div className={styles.bg} />
        <div className={styles.resetFilter}>
          <img className={styles.icReplay24pxIcon} alt="" src={replay} />
          <div className={styles.resetFilter1}>Filtreyi Sıfırla</div>
        </div>
        <div className={styles.type}>
          <img className={styles.lineIcon} alt="" src="Line.svg" />
          <img className={styles.icKeyboardArrowDown48pxIcon} alt="" src={sıralaiconu} />
          <b className={styles.orderType}>Kategori</b>
        </div>
        <div className={styles.date}>
          <img className={styles.lineIcon1} alt="" src="Line.svg" />
          <img className={styles.icKeyboardArrowDown48pxIcon1} alt="" src={sıralaiconu} />
          <b className={styles.date1}>Sırala</b>
        </div>
        <div className={styles.filterIcon}>
          <img className={styles.lineIcon2} alt="" src="Line.svg" />
          <img className={styles.filterIcon1} alt="" src={filtericon} />
        </div>
      </div>
      <img className={styles.indicatorIcon} alt="" src="Indicator.svg" />
      <div className={styles.ikayetListesi}>
        <div className={styles.bg1} />
        <div className={styles.bg1} />
        <div className={styles.div}>11111111111</div>
        <div className={styles.div1}>11111111111</div>
        <div className={styles.div2}>11111111111</div>
        <div className={styles.div3}>11111111111</div>
        <div className={styles.div4}>11111111111</div>
        <div className={styles.div5}>
          <div className={styles.labelCompleted}>
            <div className={styles.labelCompleted1}>
              <div className={styles.rectangle} />
              <b className={styles.completed}>Çözüldü</b>
            </div>
          </div>
          <div className={styles.div6}>11111111111</div>
          <img className={styles.child} alt="" src="Line 2.svg" />
          <div className={styles.christineBrooks}>Ayşe YILMAZ</div>
          <div className={styles.kutchGreenApt}>089 Kutch Green Apt. 448</div>
          <div className={styles.sep2019}>04 Sep 2019</div>
          <div className={styles.electric}>Electric</div>
          <div className={styles.div6}>11111111111</div>
          <div className={styles.button1} onClick={onButtonContainerClick}>
            <div className={styles.kYap}>İncele</div>
          </div>
        </div>
        <div className={styles.div8}>
          <div className={styles.labelProcessing}>
            <div className={styles.labelCompleted1}>
              <div className={styles.rectangle1} />
              <b className={styles.processing}>Çözülüyor</b>
            </div>
          </div>
          <div className={styles.div9}>11111111111</div>
          <img className={styles.child} alt="" src="Line 2.svg" />
          <div className={styles.rosiePearson}>Ahmet ÇAKIR</div>
          <div className={styles.immanuelFerryS}>979 Immanuel Ferry Suite 526</div>
          <div className={styles.may2019}>28 May 2019</div>
          <div className={styles.book}>Book</div>
        </div>
        <div className={styles.div10}>
          <div className={styles.labelRejected}>
            <div className={styles.labelCompleted1}>
              <div className={styles.rectangle2} />
              <b className={styles.rejected}>Çözülmedi</b>
            </div>
          </div>
          <div className={styles.labelRejected2}>
            <div className={styles.labelCompleted1}>
              <div className={styles.rectangle2} />
              <b className={styles.rejected}>Çözülmedi</b>
            </div>
          </div>
          <img className={styles.inner} alt="" src="Line 2.svg" />
          <div className={styles.darrellCaldwell}>Sema YILDIZ</div>
          <div className={styles.fridaPorts}>8587 Frida Ports</div>
          <div className={styles.nov2019}>23 Nov 2019</div>
          <div className={styles.medicine}>Medicine</div>
          <div className={styles.div11}>11111111111</div>
        </div>
        <div className={styles.div12}>
          <div className={styles.labelCompleted2}>
            <div className={styles.labelCompleted1}>
              <div className={styles.rectangle} />
              <b className={styles.completed}>Çözüldü</b>
            </div>
          </div>
          <img className={styles.child} alt="" src="Line 2.svg" />
          <div className={styles.gilbertJohnston}>Batuhan AYDIN</div>
          <div className={styles.destinyLakeSui}>768 Destiny Lake Suite 600</div>
          <div className={styles.feb2019}>05 Feb 2019</div>
          <div className={styles.mobile}>Mobile</div>
        </div>
        <div className={styles.div13}>
          <div className={styles.labelProcessing}>
            <div className={styles.labelCompleted1}>
              <div className={styles.rectangle1} />
              <b className={styles.processing}>Çözülüyor</b>
            </div>
          </div>
          <img className={styles.child} alt="" src="Line 2.svg" />
          <div className={styles.alanCain}>Fadime GÜL</div>
          <div className={styles.myleneThroughwa}>042 Mylene Throughway</div>
          <div className={styles.jul2019}>29 Jul 2019</div>
          <div className={styles.watch}>Watch</div>
        </div>
        <div className={styles.div14}>
          <div className={styles.labelCompleted4}>
            <div className={styles.labelCompleted1}>
              <div className={styles.rectangle} />
              <b className={styles.completed}>Çözüldü</b>
            </div>
          </div>
          <div className={styles.labelCompleted6}>
            <div className={styles.labelCompleted1}>
              <div className={styles.rectangle} />
              <b className={styles.completed}>Çözüldü</b>
            </div>
          </div>
          <img className={styles.child3} alt="" src="Line 2.svg" />
          <div className={styles.alfredMurray}>Mehmet GÜRSES</div>
          <div className={styles.weimannMountain}>543 Weimann Mountain</div>
          <div className={styles.aug2019}>15 Aug 2019</div>
          <div className={styles.medicine1}>Medicine</div>
        </div>
        <div className={styles.div15}>
          <div className={styles.labelProcessing}>
            <div className={styles.labelCompleted1}>
              <div className={styles.rectangle1} />
              <b className={styles.processing}>Çözülüyor</b>
            </div>
          </div>
          <img className={styles.child} alt="" src="Line 2.svg" />
          <div className={styles.maggieSullivan}>Döndü DÖNMEZ</div>
          <div className={styles.newScottieberg}>New Scottieberg</div>
          <div className={styles.jun2019}>17 Jun 2019</div>
            <div className={styles.mobile1}>Mobile</div>
        </div>
        </div>
        </div>
  );
};export default AdminPanel;
      
