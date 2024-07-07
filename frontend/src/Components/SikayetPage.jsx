import React, { useState } from 'react';
import { Button, Form, Select, Input } from 'antd';

const { Option } = Select;

const App = () => {
  const [form] = Form.useForm();
  const [topicOptions, setTopicOptions] = useState([]);

  const onFinish = (values) => {
    console.log('Success:', values);
    // Burada formun gönderim işlemleri veya istenilen diğer işlemler yapılabilir.
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const handleMainTopicChange = (value) => {
    switch (value) {
      case 'dijital-bankacilik':
        setTopicOptions(['Mobil Deniz', 'ATM', 'İnternet Bankacılığı']);
        form.setFieldsValue({ topic: undefined });
        break;
        case 'kartlar':
          setTopicOptions(['Bireysel Kredi Kartlar', 'Debit Kartlar']);
          form.setFieldsValue({ topic: undefined });
          break;
          case 'yatirim-urunleri':
            setTopicOptions(['Yatırım İşlemleri']);
            form.setFieldsValue({ topic: undefined });
            break;
              case 'mevduat':
                setTopicOptions(['Para Transferi','Vadeli Mevduat']);
                form.setFieldsValue({ topic: undefined });
                break;
                case 'fraud-yonetimi':
                  setTopicOptions(['Hesap/Kart Bloke Kaldırma','EFT/Havale Teyit','Dolandırıcılık/Bilgisi Dışında Şüpheli Kart İşlemleri','Bilgi-Belge Sahteciliği/Kayıp']);
                  form.setFieldsValue({ topic: undefined });
                  break;
                  case 'sigorta':
                    setTopicOptions(['Konut Sigortası','Bireysel Kredi Hayat Sigortası','Ferdi Kaza Sigortası']);
                    form.setFieldsValue({ topic: undefined });
                    break;
                    case 'hizmet-kalitesi':
                      setTopicOptions(['İletişim Merkezi']);
                      form.setFieldsValue({ topic: undefined });
                      break;
      
       
    }
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
          form={form}
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
            <Select placeholder="Ana Konu Seçin" onChange={handleMainTopicChange}>
              <Option value="dijital-bankacilik">Dijital Bankacılık</Option>
              <Option value="kartlar">Kartlar</Option>
              <Option value="yatirim-urunleri">Yatırım Ürünleri</Option>
              <Option value="mevduat">Mevduat</Option>
              <Option value="fraud-yonetimi">Fraud Yönetimi</Option>
              <Option value="sigorta">Sigorta</Option>
              <Option value="hizmet-kalitesi">Hizmet Kalitesi</Option>
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
              {topicOptions.map((option) => (
                <Option key={option} value={option}>{option}</Option>
              ))}
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
