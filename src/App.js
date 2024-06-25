// src/App.js
import { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
//import { Button, Menu, MenuItem } from "@mui/material/";
import Login from "./components/Login";
import Crud from "./components/Crud";
import OrderForm from "./components/OrderForm";
import Payment from "./components/Payment";
import IGENPacientes from "./components/IGENPacientes";
import Foto from "./components/foto";
import "./App.css";


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
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
          <div class="container-fluid">
            <a class="navbar-brand" href="/">
              Cogniti
            </a>
            <button
              class="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
              <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item">
                  <a class="nav-link active" aria-current="page" href="/">
                    Banco Sangre
                  </a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="/">
                    Suministros
                  </a>
                </li>
                <li class="nav-item dropdown">
                  <a
                    class="nav-link dropdown-toggle"
                    href="/"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Configuracion
                  </a>
                  <ul class="dropdown-menu">
                    <li>
                      <a class="dropdown-item" href="/">
                      CRUD
                      </a>
                    </li>
                    <li>
                      <a class="dropdown-item" href="/IGENPacientes">
                      Nueva Solicitud
                      </a>
                    </li>
                    <li>
                      <hr class="dropdown-divider" />
                    </li>
                    <li>
                      <a class="dropdown-item" href="/">
                      <Link to="/payment">Pago</Link>
                      </a>
                    </li>
                    <li>
                      <hr class="dropdown-divider" />
                    </li>
                    <li>
                    <Link to="/XorEncryptor"/> 
                    </li>
                  </ul>
                </li>
              </ul>
              <form class="d-flex" role="search">
                <input
                  class="form-control me-2"
                  type="search"
                  placeholder="Buscar"
                  aria-label="Search"
                />
                <button class="btn btn-outline-success" type="submit">
                  Buscar
                </button>
              </form>
            </div>
          </div>
        </nav>
        <br />
        <Routes>
          <Route path="/" element={<Crud />} />
          <Route path="/order" element={<OrderForm />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/IGENPacientes" element={<IGENPacientes />} />
          <Route path="/dimensiones" element={<div>Dimensiones</div>} />
          {/* Añadir componente */}
          <Route path="/hemocomponentes" element={<div>Hemocomponentes</div>}/>
          {/* Añadir componente */}
          <Route path="/tipobolsas" element={<div>Tipo Bolsas</div>} />{" "}
          {/* Añadir componente */}
          <Route path="/foto" element={<Foto />} /> {/* Añadir componente */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
