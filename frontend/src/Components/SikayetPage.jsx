import React from 'react';
import { Button, Form, Select, Input } from 'antd';

const { Option } = Select;

const App = () => {
  const onFinish = (values) => {
    console.log('Success:', values);
    // Burada formun gönderim işlemleri veya istenilen diğer işlemler yapılabilir.
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
        minHeight: '100vh',
        background: '#f0f2f5',
        padding: '20px',
        width: '100%'
      }}
    >
      <h1 style={{ marginBottom: '25px' }}>Mesaj Formu</h1>

      <div
        style={{
          width: '100%',
          maxWidth: '1200px',
          background: '#fff',
          padding: '40px',
          borderRadius: '10px',
          boxShadow: '0 0 15px rgba(0,0,0,0.1)',
          boxSizing: 'border-box',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Form
          name="message_form"
          style={{ width: '100%', maxWidth: '600px' }}
          labelCol={{
            xs: { span: 24 },
            sm: { span: 8 }, // Etiket genişliği artırıldı
          }}
          wrapperCol={{
            xs: { span: 24 },
            sm: { span: 16 }, // Wrapper genişliği artırıldı
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Bildirim Tipi"
            name="notificationType"
            rules={[
              {
                required: true,
                message: 'Lütfen bildirim tipini seçiniz!',
              },
            ]}
          >
            <Select placeholder="Bildirim Tipi Seçin">
              <Option value="duyuru">Duyuru</Option>
              <Option value="soru">Soru</Option>
              <Option value="şikayet">Şikayet</Option>
              <Option value="teklif">Teklif</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Ana Konu"
            name="mainTopic"
            rules={[
              {
                required: true,
                message: 'Lütfen ana konuyu belirtiniz!',
              },
            ]}
          >
            <Select placeholder="Ana Konu Seçin">
              <Option value="bankacılık">Bankacılık</Option>
              <Option value="finans">Finans</Option>
              <Option value="sigortacılık">Sigortacılık</Option>
              <Option value="kredi">Kredi</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Konu"
            name="topic"
            rules={[
              {
                required: true,
                message: 'Lütfen konuyu belirtiniz!',
              },
            ]}
          >
            <Select placeholder="Konu Seçin">
              <Option value="mobil bankacılık">Mobil Bankacılık</Option>
              <Option value="yatırım ürünleri">Yatırım Ürünleri</Option>
              <Option value="mevduatlar">Mevduatlar</Option>
              <Option value="çevrimiçi işlemler">Çevrimiçi İşlemler</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Alt Konu"
            name="subTopic"
            rules={[
              {
                required: true,
                message: 'Lütfen alt konuyu belirtiniz!',
              },
            ]}
          >
            <Select placeholder="Alt Konu Seçin">
              <Option value="kart işlemleri">Kart İşlemleri</Option>
              <Option value="şifre işlemleri">Şifre İşlemleri</Option>
              <Option value="havale ve EFT">Havale ve EFT</Option>
              <Option value="müşteri hizmetleri">Müşteri Hizmetleri</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Mesaj"
            name="message"
            rules={[
              {
                required: true,
                message: 'Lütfen mesajınızı yazınız!',
              },
            ]}
          >
            <Input.TextArea rows={4} placeholder="Mesajınızı buraya yazınız" />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 8, // Butonu ortalamak için eklendi
              span: 16,
              style: { display: 'flex', justifyContent: 'center' } // Butonu ortalamak için eklendi
            }}
          >
            <Button type="primary" htmlType="submit" style={{ width: '150px' }}>
              Şikayet Oluştur
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default App;
