// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Login from './components/Login';
import Crud from './components/Crud';
import OrderForm from './components/OrderForm';
import Payment from './components/Payment';
import IGENPacientes from './Cogniti/IGENPacientes'
import './App.css';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = (username) => {
    if (username) {
      setLoggedIn(true);
    }
  };

  if (!loggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div className="App">
        <nav>
          <Link to="/">CRUD</Link> | 
          <Link to="/order">Orden de Compra</Link> | 
          <Link to="/payment">Pago</Link>
          <Link to="/IGENPacientes">Nuevo Paciente</Link>          
        </nav>
        <Routes>
          <Route path="/" element={<Crud />} />
          <Route path="/order" element={<OrderForm />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/IGENPacientes" element={<IGENPacientes />} />
         
        </Routes>
      </div>
    </Router>
  );
}

export default App;
