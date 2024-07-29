import React, { useState, useEffect } from "react";
import styles from "../CSS/Chat.module.css";
import indir1 from "../Png/indir1.png";
import { Input, Button, List, Layout } from "antd";
import axios from "axios";
import Ellipse1 from "../Png/Ellipse1.png";
import Group from "../Png/Group.svg";

const { Header, Content } = Layout;

function Chat() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const userInfo = JSON.parse(localStorage.getItem("userInfo")); // Retrieve user info from local storage

  useEffect(() => {
    if (userInfo) {
      console.log("Retrieved user info from localStorage:", userInfo); // Log the user info
    }
    setMessages([
      {
        sender: "bot",
        text:
          "Merhaba! Ben I-Bot. DenizŞikayet platformunun yapay zeka robotuyum. " +
          "Şikayetinizin en kısa sürede iletilip çözümlenmesi için size ben yardımcı " +
          "olacağım. Şimdi tüm detaylarıyla şikayetinizi yazabilirsiniz :)",
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  }, []);

  const sendMessage = () => {
    if (inputValue.trim()) {
      const userMessage = {
        sender: "user",
        text: inputValue,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((messages) => [...messages, userMessage]);

      const payload = {
        user_id: userInfo.user_id, // Ensure user_id is included
        ...userInfo,
        request: inputValue,
        request_date: new Date().toISOString().split("T")[0],
        request_status: "Çözülmedi",
        catagory: "",
      };

      console.log("Payload being sent:", payload); // Log the payload
      axios
        .post("http://127.0.0.1:8000/classify-query/", payload)
        .then((response) => {
          const botMessageCategory = response.data.catagory;
          const botMessage =
            botMessageCategory ===
            "Üzgünüm, sadece sınıflandırma işlemlerini uyguluyorum."
              ? botMessageCategory
              : `Şikayetinizi detaylıca açıkladığınız için teşekkür ederim:) Şikayetinizi "${botMessageCategory}" birimine ilettim. Şikayetinizin en kısa zamanda değerlendirilip, tarafınıza dönüş yapılacağından emin olabilirsiniz.İyi günler dilerim.`;
          const timestamp = new Date().toLocaleTimeString();

          setMessages((messages) => [
            ...messages,
            { sender: "bot", text: botMessage, timestamp },
          ]);
        })
        .catch((error) => {
          console.error("Error fetching response from backend:", error);
          setMessages((messages) => [
            ...messages,
            {
              sender: "bot",
              text: "Bir hata oluştu. Lütfen tekrar deneyin.",
              timestamp: new Date().toLocaleTimeString(),
            },
          ]);
        });

      setInputValue("");
    }
  };

  return (
    <div className={styles.App}>
      <div className={styles.container}>
        <div className={`${styles.column} ${styles["column-1"]}`}>
          <img src={indir1} alt="Example" className={styles.image} />
        </div>
        <div className={`${styles.column} ${styles["column-2"]}`}>
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
                renderItem={(item) => (
                  <List.Item
                    key={item.timestamp + item.sender}
                    className={
                      item.sender === "user"
                        ? `${styles.message} ${styles.user}`
                        : `${styles.message} ${styles.bot}`
                    }
                  >
                    {item.sender === "bot" && (
                      <img
                        src={Ellipse1}
                        alt="Ellipse"
                        className={styles.botMessageImage}
                      />
                    )}
                    <div
                      className={
                        item.sender === "user"
                          ? styles.userMessageContent
                          : styles.botMessageContent
                      }
                    >
                      <div className={styles.messageText}>{item.text}</div>
                      <div className={styles.timestamp}>
                        {item.sender === "user" && (
                          <img src={Group} alt="Group Icon" />
                        )}
                        {item.timestamp}
                      </div>
                    </div>
                  </List.Item>
                )}
                className={styles.messageList}
              />
              <div className={styles.divider2}></div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onPressEnter={sendMessage}
                  placeholder="Şikayetlerinizi yazınız..."
                  className={styles.input}
                />
                <Button
                  type="primary"
                  onClick={sendMessage}
                  className={styles.button}
                >
                  Gönder
                </Button>
              </div>
            </Content>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
