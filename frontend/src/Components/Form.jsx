import React from 'react';
import { Button, Checkbox, Form, Input } from 'antd';
import { WechatOutlined} from '@ant-design/icons';




const onFinish = (values) => {
  console.log('Success:', values);
};

const onFinishFailed = (errorInfo) => {
  console.log('Failed:', errorInfo);
};

const App = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    flexDirection: 'column', 
    height: '100vh', 
    background: '#f0f2f5', 
    padding: '20px' 
  }}>
   <h1 style={{ marginBottom: '25px', display: 'flex', alignItems: 'center' }}>
      NOCASHFLOW
      <WechatOutlined style={{ marginLeft: '10px' }} />
    </h1>


    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      background: '#fff', 
      padding: '40px', 
      borderRadius: '10px', 
      boxShadow: '0 0 15px rgba(0,0,0,0.1)',
      maxWidth: '600px', 
      width: '100%',
      boxSizing: 'border-box'
    }}>
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
          label="Username"
          name="username"
          rules={[
            {
              required: true,
              message: 'Please input your username!',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="remember"
          valuePropName="checked"
          wrapperCol={{
            offset: 6,
            span: 18,
          }}
        >
          <Checkbox>Remember me</Checkbox>
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
  </div>
);

export default App;
