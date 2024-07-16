import { FunctionComponent } from 'react';
import styles from '../CSS/Chat.module.css';
import indir1 from '../Png/indir1.png';
import Rectangle3 from '../Png/Rectangle3.png';
import Group from '../Png/Group.svg';


const Chat: FunctionComponent = () => {
    return (
        <div className={styles.chatBa}>
            <img className={styles.chatBaChild} alt="" src={Rectangle3} />
            <img className={styles.indir11} alt="" src={indir1} />
            <div className={styles.rectangleParent}>
                <div className={styles.groupChild} />
                <div className={styles.groupParent}>
                    <img className={styles.frameChild} alt="" src="Group 1.png" />
                    <div className={styles.message}>
                        <div className={styles.messageTextContainer}>
                            <p className={styles.messageText}>Şikayetinizi detaylıca açıkladığınız için teşekkür ederim:) Şikayetinizi</p>
                            <p className={styles.messageText}>“Atm” birimine ilettim. Şikayetinizin en kısa zamanda değerlendirilip ,</p>
                            <p className={styles.messageText}>tarafınıza dönüş yapılacağından emin olabilirsiniz. Musmutlu günler</p>
                            <p className={styles.messageText}>dilerim.</p>
                        </div>
                        <div className={styles.messageTime}>15:42</div>
                    </div>
                </div>
                <div className={styles.message}>
                    <div className={styles.messageTextContainer}>
                        <p className={styles.messageText}>18:13:50 tarihinde G2626 atmsinde 100 tl para yatırırken atmden</p>
                        <p className={styles.messageText}>kaynaklı oluşan sorundan dolayı işlem gerçeklşirememiştir.</p>
                        <p className={styles.messageText}>gereğinin yapılmasını isterim. syg</p>
                    </div>
                    <div className={styles.groupGroup}>
                        <img className={styles.groupIcon} alt="" src={Group} />
                        <div className={styles.messageTime}>15:42</div>
                    </div>
                </div>
                <div className={styles.groupContainer}>
                    <img className={styles.frameChild} alt="" src="Group 1.png" />
                    <div className={styles.message}>
                        <div className={styles.messageTextContainer}>
                            <p className={styles.messageText}>Merhaba! Ben I-Bot. DenizŞikayet platformunun yapay zeka robotuyum.</p>
                            <p className={styles.messageText}>Şikayetinizin en kısa sürede iletilip çözümlenmesi için size ben yardımcı</p>
                            <p className={styles.messageText}>olacağım. Şimdi tüm detaylarıyla şikayetinizi yazabilirsiniz :)</p>
                        </div>
                        <div className={styles.messageTime}>15:42</div>
                    </div>
                </div>
                <div className={styles.rectangleGroup}>
                    <div className={styles.groupItem} />
                    <div className={styles.frameDiv}>
                        <div className={styles.rectangleContainer}>
                            <div className={styles.groupInner} />
                            <div className={styles.inputPlaceholder}>Şikayetinizi yazın.</div>
                        </div>
                        <div className={styles.sendButton}>Gönder</div>
                    </div>
                </div>
                <div className={styles.groupDiv}>
                    <div className={styles.rectangleDiv} />
                    <div className={styles.frameWrapper}>
                        <div className={styles.frameContainer}>
                            <div className={styles.groupParent1}>
                                <img className={styles.frameInner} alt="" src="Group 1.png" />
                                <div className={styles.iBotParent}>
                                    <b className={styles.iBot}>I-Bot</b>
                                    <div className={styles.onlineStatus}>Çevrimiçi</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.lineDiv} />
                </div>
            </div>
        </div>
    );
};

export default Chat;
