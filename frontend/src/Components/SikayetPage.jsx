import React, { useState, useEffect } from 'react';
import { Input, Button, List, Layout } from 'antd';
import { WechatOutlined } from '@ant-design/icons';
const { Header, Content } = Layout;

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');

  // useEffect hook to send welcome message on component mount
  useEffect(() => {
    setMessages([{ sender: 'bot', text: 'Size nasıl yardımcı olabilirim?' }]);
  }, []);

  const sendMessage = () => {
    if (inputValue.trim()) {
      setMessages([...messages, { sender: 'user', text: inputValue }]);
      setInputValue('');
      // Here, you can add logic to get the chatbot's response
      setTimeout(() => {
        setMessages(prevMessages => [
          ...prevMessages,
          { sender: 'bot', text: 'Bu, chatbot\'tan bir yanıt.' }
        ]);
      }, 1000);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '40px', width: '400px', paddingBottom: '40px' }}>
      <Layout>
        <Header style={{ color: 'white', textAlign: 'center', backgroundColor: '#001529', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          Chatbot
          <WechatOutlined style={{ fontSize: '24px', marginLeft: '10px' }} />
        </Header>

        <Content style={{ padding: '20px', height: 'calc(100vh - 64px - 70px)' }}>
          <List
            dataSource={messages}
            renderItem={item => (
              <List.Item style={{ textAlign: item.sender === 'user' ? 'right' : 'left' }}>
                <List.Item.Meta description={item.text} />
              </List.Item>
            )}
            style={{ height: 'calc(100vh - 64px - 70px - 80px)', overflowY: 'scroll' }}
          />
          <Input
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onPressEnter={sendMessage}
            placeholder="Type a message"
            style={{ marginTop: '20px' }}
          />
          <Button type="primary" onClick={sendMessage} style={{ marginTop: '10px' }}>
            Send
          </Button>
        </Content>
      </Layout>
    </div>
  );
};

export default Chatbot;
