import React, { useState, useEffect } from 'react';
import styles from '../CSS/Chat.module.css';
import indir1 from '../Png/indir1.png';
import { Input, Button, List, Layout } from 'antd';
import axios from 'axios';
import Ellipse1 from '../Png/Ellipse1.png';
import Group from '../Png/Group.svg';
import { SentenceTransformer } from 'sentence-transformers';
import dotenv from 'dotenv';
import { cosineSimilarity } from 'ml-distance';
import fs from 'fs';

dotenv.config();
process.env.TOKENIZERS_PARALLELISM = "false";

const { Header, Content } = Layout;

const readJsonFile = (filePath) => {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
};

const semanticSearch = async (query, messages, model, top_k = 20) => {
    const contentList = messages.map(msg => msg.content);
    const queryEmbedding = await model.encode([query]);
    const contentEmbeddings = await model.encode(contentList);

    const similarities = contentEmbeddings.map(content => cosineSimilarity(queryEmbedding[0], content));
    const topIndices = similarities
        .map((sim, idx) => [sim, idx])
        .sort((a, b) => b[0] - a[0])
        .slice(0, top_k)
        .map(item => item[1]);

    return topIndices.map(index => messages[index]);
};

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        setMessages([{
            sender: 'bot',
            text: 'Merhaba! Ben I-Bot. DenizŞikayet platformunun yapay zeka robotuyum. ' +
                  'Şikayetinizin en kısa sürede iletilip çözümlenmesi için size ben yardımcı ' +
                  'olacağım. Şimdi tüm detaylarıyla şikayetinizi yazabilirsiniz :)',
            timestamp: new Date().toLocaleTimeString()
        }]);
    }, []);

    const sendMessage = async () => {
        if (inputValue.trim()) {
            const userMessage = { sender: 'user', text: inputValue, timestamp: new Date().toLocaleTimeString() };
            setMessages([...messages, userMessage]);
            setInputValue('');

            const filePath = 'few_shots.json';
            const allMessages = readJsonFile(filePath);

            const model = new SentenceTransformer('all-MiniLM-L6-v2');
            const prompt = "Sen, banka müşterilerinin şikayetlerini belirli kategorilere göre sınıflandıran bir yapay zeka asistanısın. Müşterilerden gelen yorumları, aşağıda belirtilen kategorilere göre sınıflandıracaksın. Eğer sınıflandırma dışında bir taleple karşılaşırsan, 'Üzgünüm, sadece sınıflandırma işlemlerini uyguluyorum.' şeklinde yanıt vereceksin. Sınıflandırma Kategorileri: MobilDeniz, ATM, İnternet Bankacılığı, Bireysel Kredi Kartları, Debit Kartlar, Yatırım İşlemleri, Para Transferi, Vadeli Mevduat, Hesap Kart Bloke Kaldırma, EFL/HAVAL Teyit, Dolandırcılık/Bilgi Dışı Şüpheli Hesap Kart İşlemleri, Bilgi/Belge Sahteciliği/Kayıp, Konut Sigortası, Bireysel Hayat Sigortası, Ferdi Kaza Sigortası, İletişim Merkezi. Vereceğin cevap formatı sadece İlgili kategoriyi belirtmelisin başka hiçbir şey yazmamalısın.";

            const relevantMessages = await semanticSearch(inputValue, allMessages, model);

            const messageText = [{ role: "assistant", content: prompt }, ...relevantMessages, { role: "user", content: inputValue }];

            try {
                const response = await axios.post('https://rgacademy3oai.openai.azure.com/openai/deployments/gpt-4o/chat/completions?api-version=2024-02-15-preview', {
                    model: "gpt-4o",
                    messages: messageText,
                    max_tokens: 4096,
                    temperature: 0.7,
                    top_p: 0.95,
                    stop: null
                }, {
                    headers: {
                        'Authorization': `Bearer ${process.env.AZURE_OPENAI_KEY}`,
                        'Content-Type': 'application/json'
                    }
                });

                const botMessage = response.data.choices[0].message.content;
                const timestamp = new Date().toLocaleTimeString();
                setMessages(prevMessages => [
                    ...prevMessages,
                    { sender: 'bot', text: botMessage, timestamp }
                ]);
            } catch (error) {
                console.error("Error fetching response from OpenAI:", error);
                setMessages(prevMessages => [
                    ...prevMessages,
                    { sender: 'bot', text: 'Bir hata oluştu. Lütfen tekrar deneyin.', timestamp: new Date().toLocaleTimeString() }
                ]);
            }
        }
    };

    return (
        <div className={styles.App}>
            <div className={styles.container}>
                <div className={`${styles.column} ${styles['column-1']}`}>
                    <img src={indir1} alt="Example" className={styles.image} />
                </div>
                <div className={`${styles.column} ${styles['column-2']}`}>
                    <div className={styles.rectangleDiv}>
                        <Header className={styles.header}>
                            <img className={styles.frameChild} src={Ellipse1} alt="Ellipse" />
                            <div className={styles.botName}>
                                <p className={styles.botTitle}>I-Bot</p>
                                <p className={styles.onlineStatus}>Çevrimiçi</p>
                            </div>
                        </Header>
                        <div className={styles.divider1}></div>
                        <Content className={styles.content}>
                            <List
                                dataSource={messages}
                                renderItem={item => (
                                    <List.Item className={item.sender === 'user' ? styles.message + ' ' + styles.user : styles.message + ' ' + styles.bot}>
                                        {item.sender === 'bot' && <img src={Ellipse1} alt="Ellipse" className={styles.botMessageImage} />}
                                        <div className={item.sender === 'user' ? styles.userMessageContent : styles.botMessageContent}>
                                            <div className={styles.messageText}>{item.text}</div>
                                            <div className={styles.timestamp}>
                                            {item.sender === 'user' && <img src={Group} alt="Group Icon" />}
                                                {item.timestamp}
                                            </div>
                                        </div>
                                    </List.Item>
                                )}
                                className={styles.messageList}
                            />
                            <div className={styles.divider2}></div>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Input
                                    value={inputValue}
                                    onChange={e => setInputValue(e.target.value)}
                                    onPressEnter={sendMessage}
                                    placeholder="Şikayetlerinizi yazınız..."
                                    className={styles.input}
                                />
                                <Button type="primary" onClick={sendMessage} className={styles.button}>
                                    Gönder
                                </Button>
                            </div>
                        </Content>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;
