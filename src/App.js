// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Login from './components/Login';
import Crud from './components/Crud';
import OrderForm from './components/OrderForm';
import Payment from './components/Payment';
import IGENPacientes from './components/IGENPacientes'
import './App.css';
import styled from "styled-components";

const AppContainer = styled.div`
  text-align: left;
  background-color: #f8f9fa;
  padding: 20px;
  min-height: 100vh;
  font-family: Century Gothic' !important;
`;

const Nav = styled.nav`
  display: flex;
  justify-content: right;
  align-items: center;
  background-color: black;
  padding: 15px;
  border-radius: 5px;
`;

const StyledLink = styled(Link)`
  color: black;
  text-decoration: none;
  margin: 0 15px;
  font-weight: bold;
  transition: color 0.3s ease;

  &:hover {
    color: #ffcb05;
  }

  &.active {
    color: black;
    border-bottom: 2px solid #ffc107;
  }
`;

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
      <AppContainer>
      <div className="App">
        <Nav id="Menu">
          <StyledLink  to="/">CRUD</StyledLink > | 
          <StyledLink  to="/order">Orden de Compra</StyledLink > | 
          <StyledLink  to="/payment">Pago</StyledLink >|
          <StyledLink  to="/IGENPacientes">Nuevo Paciente</StyledLink >    
        </Nav>
        <br/>
        <Routes>
          <Route path="/" element={<Crud />} />
          <Route path="/order" element={<OrderForm />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/IGENPacientes" element={<IGENPacientes />} />
        </Routes>
      </div>
      </AppContainer>
    </Router>
  );
}

export default App;
