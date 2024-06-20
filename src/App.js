// src/App.js
import { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { Button, Menu, MenuItem } from "@mui/material/";
import Login from "./components/Login";
import Crud from "./components/Crud";
import OrderForm from "./components/OrderForm";
import Payment from "./components/Payment";
import IGENPacientes from "./components/IGENPacientes";
import Foto from "./components/foto"
import "./App.css";
import styled from "styled-components";

const AppContainer = styled.div`
  text-align: left;
  background-color: #f8f9fa;
  padding: 20px;
  min-height: 100vh;
  font-family: 'Century Gothic' !important;
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-around; /* Distribuye el espacio entre los elementos */
  align-items: center;
  background-color: #953192 !important;
  padding: 10px;
  border-radius: 10px;
  font-family: 'Century Gothic' !important;
`;

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  // Estado para el menú "Banco Sangre"
  const [anchorElBancoSangre, setAnchorElBancoSangre] = useState(null);
  const openBancoSangre = Boolean(anchorElBancoSangre);
  const handleClickBancoSangre = (event) => {
    setAnchorElBancoSangre(event.currentTarget);
  };
  const handleCloseBancoSangre = () => {
    setAnchorElBancoSangre(null);
  };

  // Estado para el menú "Configuración"
  const [anchorElConfiguracion, setAnchorElConfiguracion] = useState(null);
  const openConfiguracion = Boolean(anchorElConfiguracion);
  const handleClickConfiguracion = (event) => {
    setAnchorElConfiguracion(event.currentTarget);
  };
  const handleCloseConfiguracion = () => {
    setAnchorElConfiguracion(null);
  };

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
            {/* Menú Banco Sangre */}
            <Button
              id="basic-button"
              aria-controls={openBancoSangre ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={openBancoSangre ? "true" : undefined}
              onClick={handleClickBancoSangre}
              style={{ color: 'white' }} // Ajusta el color del texto del botón
            >
              Banco Sangre
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorElBancoSangre}
              open={openBancoSangre}
              onClose={handleCloseBancoSangre}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <MenuItem component={Link} to="/" onClick={handleCloseBancoSangre}>CRUD</MenuItem>
              <MenuItem component={Link} to="/order" onClick={handleCloseBancoSangre}>Orden Compra</MenuItem>
              <MenuItem component={Link} to="/payment" onClick={handleCloseBancoSangre}>Mercado Pago</MenuItem>
              <MenuItem component={Link} to="/IGENPacientes" onClick={handleCloseBancoSangre}>Nueva Solicitud</MenuItem>
              <MenuItem component={Link} to="/IBSSeparacionHemocomponentes" onClick={handleCloseBancoSangre}>Separacion Hemocomponentes</MenuItem>
              <MenuItem component={Link} to="/foto" onClick={handleCloseBancoSangre}>Foto</MenuItem>
            </Menu>

            {/* Menú Configuración */}
            <Button
              id="config-button"
              aria-controls={openConfiguracion ? "config-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={openConfiguracion ? "true" : undefined}
              onClick={handleClickConfiguracion}
              style={{ color: 'white' }} // Ajusta el color del texto del botón
            >
              Configuración
            </Button>
            <Menu
              id="config-menu"
              anchorEl={anchorElConfiguracion}
              open={openConfiguracion}
              onClose={handleCloseConfiguracion}
              MenuListProps={{
                "aria-labelledby": "config-button",
              }}
            >
              <MenuItem component={Link} to="/dimensiones" onClick={handleCloseConfiguracion}>Dimensiones</MenuItem>
              <MenuItem component={Link} to="/hemocomponentes" onClick={handleCloseConfiguracion}>Hemocomponentes</MenuItem>
              <MenuItem component={Link} to="/tipobolsas" onClick={handleCloseConfiguracion}>Tipo Bolsas</MenuItem>
            </Menu>
          </Nav>
          <br />
          <Routes>
            <Route path="/" element={<Crud />} />
            <Route path="/order" element={<OrderForm />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/IGENPacientes" element={<IGENPacientes />} />
            <Route path="/dimensiones" element={<div>Dimensiones</div>} /> {/* Añadir componente */}
            <Route path="/hemocomponentes" element={<div>Hemocomponentes</div>} /> {/* Añadir componente */}
            <Route path="/tipobolsas" element={<div>Tipo Bolsas</div>} /> {/* Añadir componente */}
            <Route path="/foto" element={<Foto/>} /> {/* Añadir componente */}
          </Routes>
        </div>
      </AppContainer>
    </Router>
  );
}

export default App;
