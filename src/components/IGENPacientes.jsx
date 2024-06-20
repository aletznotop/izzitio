// Importaciones de Librerías y Componentes
import React, { useState, useEffect } from "react";
import { Box, Container, CssBaseline, Stack, Grid, Button, Snackbar } from "@mui/material";
import DatosDemograficos from "./DatosDemograficos";
import CamposDinamicos from "./CamposDinamicos";
import { obtenerCampos } from "../dimensiones/dimensiones.js";
import { fetchTipoIdOptions, fetchSexoOptions, insertarPaciente, buscarPaciente } from "../utils/api";
import MuiAlert from '@mui/material/Alert';
import dayjs from 'dayjs';
// Estado Inicial del Formulario
const initialFormData = {
  IDTIPOIDENTIFICACION: 0,
  ABREVIATURATIPOIDENTIFICACION: "",
  NUMEROIDENTIFICACION:0,
  FECHANACIMIENTO: dayjs(),
  EDAD:0,
  NOMBRE1:"",
  NOMBRE2:"",
  APELLIDO1:"",
  APELLIDO2:"",
  IDSEXO:0,
  SEXO:"",
  ACTIVO:0,
  IDPACIENTE:0,
  IDENTIDAD:0,
  IDPLAN:0,
  D0:"",
  D1:"",
  D2:"",
  D3:"",
  D4:"",
  D5:"",
  D6:"",
  D7:"",
  D8:"",
  D9:"",
  IDPACIENTEHE:0,
  GRUPORH:"",
  HUELLA:"",
};

const IGENPacientes = () => {
  // useState: Inicializa estados para opciones de tipo de identificación, opciones de sexo, campos dinámicos, datos del formulario, mensajes de Snackbar y la visibilidad de Snackbar.
  const [tipoIdOptions, setTipoIdOptions] = useState([]);
  const [sexoOptions, setSexoOptions] = useState([]);
  const [camposDinamicos, setCamposDinamicos] = useState([]);
  const [formData, setFormData] = useState(initialFormData);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
 


  useEffect(() => {
    fetchTipoIdOptions(setTipoIdOptions);
    fetchSexoOptions(setSexoOptions);
    // Fetching dynamic fields
    const obtenerCamposDinamicos = async () => {
      const campos = await obtenerCampos(); // asume que esto devuelve los campos dinámicos
      setCamposDinamicos(campos.recordset);
    };
    obtenerCamposDinamicos();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    // console.log(name,value,event.target);
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await insertarPaciente(formData);
      setSnackbarMessage(`Paciente creado exitosamente. ID: ${response.output.ULTIMO}`);
      setOpenSnackbar(true);
      const dynamicInitialFormData = camposDinamicos.reduce((acc, campo) => {
        acc[campo.NOMBRECORTO] = "";
        return acc;
      }, {});
      setFormData({ ...initialFormData, ...dynamicInitialFormData }); // Reset form on successful submission
    } catch (error) {
      console.error("Error:", error);
      setSnackbarMessage('Error al crear el paciente',error);
      setOpenSnackbar(true);
    }
  };

  const handleSearch = async () => {
    try {
      const paciente = await buscarPaciente(formData.NUMEROIDENTIFICACION);
      const fechaNacimiento = dayjs(paciente.FECHANACIMIENTO,'YYYY-MM-DD','es');
    if (!fechaNacimiento.isValid()) {
      throw new Error("Fecha no Valida");
    }
      setFormData((prevData) => ({
        ...prevData,
        ...paciente,
      }));
    } catch (error) {
      console.error("Error in search:", error);
    }
  };

  const handleCloseSnackbar = () => setOpenSnackbar(false);

  return (
    <Container component="main">
      <CssBaseline />
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, "& .MuiTextField-root": { m: 2, width: "100%" } }}>
        <Grid container spacing={8} justifyContent="flex-start">
          <Grid item xs={12} sm={6}>
            <DatosDemograficos formData={formData} tipoIdOptions={tipoIdOptions} sexoOptions={sexoOptions} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CamposDinamicos campos={camposDinamicos} formData={formData} onChange={handleChange} />
          </Grid>
        </Grid>
        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 2 }}>
          <Button type="submit" fullWidth variant="contained" size="small">Enviar</Button>
          <Button type="button" fullWidth variant="contained" size="small" onClick={handleSearch}>Buscar</Button>
        </Stack>
        <Snackbar open={openSnackbar} autoHideDuration={1000} onClose={handleCloseSnackbar}>
          <MuiAlert onClose={handleCloseSnackbar} severity="success" elevation={6} variant="filled">
            {snackbarMessage}
          </MuiAlert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default IGENPacientes;