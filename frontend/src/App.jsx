import './App.css';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Form from './Components/Form';
import SikayetPage from './Components/SikayetPage';


function App() {
  return (
    <Router>
      <Form>
       <SikayetPage></SikayetPage>
      </Form>
    </Router>
  );
}

export default App;


