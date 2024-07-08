import React, { useState } from 'react';
import { Button, Form, Input } from 'antd';
import logoImage from '../Png/no (3).png';
import SikayetPage from './SikayetPage';

const App = () => {
  const [formSubmitted, setFormSubmitted] = useState(false); // State to track form submission

  const onFinish = (values) => {
    console.log('Success:', values);
    setFormSubmitted(true); // Set formSubmitted to true upon successful submission
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        height: '100vh',
        background: '#f0f2f5',
        padding: '20px',
      }}
    >
      {!formSubmitted ? ( // Render form if formSubmitted is false
        <>
          <h1
            style={{
              marginBottom: '25px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
           İLETİŞİM BİLGİLERİ
            <img
              src={logoImage}
              style={{ height: '40px', borderRadius: '50%', marginLeft: '10px' }}
              alt="logo"
            />
          </h1>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              background: '#fff',
              padding: '40px',
              borderRadius: '10px',
              boxShadow: '0 0 15px rgba(0,0,0,0.1)',
              maxWidth: '600px',
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            <Form
              name="basic"
              style={{ width: '100%' }}
              labelCol={{
                xs: { span: 8 },
                sm: { span: 6 },
              }}
              wrapperCol={{
                xs: { span: 16 },
                sm: { span: 15 },
              }}
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Form.Item
                label="İsim"
                name="firstName"
                rules={[
                  {
                    required: true,
                    message: 'Lütfen isminizi girin!',
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Soyisim"
                name="lastName"
                rules={[
                  {
                    required: true,
                    message: 'Lütfen soyisminizi girin!',
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="TC Kimlik No"
                name="tcNumber"
                rules={[
                  {
                    required: true,
                    message: 'Lütfen TC kimlik numaranızı girin!',
                  },
                  {
                    pattern: /^[0-9]{11}$/,
                    message: 'TC kimlik numarası 11 haneli olmalıdır!',
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Telefon Numarası"
                name="phoneNumber"
                rules={[
                  {
                    required: true,
                    message: 'Lütfen telefon numaranızı girin!',
                  },
                  {
                    pattern: /^[0-9]{10}$/,
                    message: 'Telefon numarası 10 haneli olmalıdır!',
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                wrapperCol={{
                  offset: 6,
                  span: 18,
                }}
              >
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </div>
        </>
      ) : ( // Render SikayetPage component if formSubmitted is true
        <SikayetPage />
      )}
    </div>
  );
};

export default App;
