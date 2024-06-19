import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Box,
  Typography,
  Container,
  CssBaseline,
  Stack,
  Grid,
  Snackbar,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { obtenerCampos } from "../dimensiones/dimensiones.js";
import MuiAlert from '@mui/material/Alert';
import axios from "axios";
import dayjs from "dayjs";

const IGENPaciente = () => {
  const [tipoIdOptions, setTipoIdOptions] = useState([]);
  const [sexoOptions, setSexoOptions] = useState([]);
  const [edad, setAge] = useState("");
  const [birthDate, setBirthDate] = useState(null);
  const [camposDinamicos, setCamposDinamicos] = useState([]);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  //OBTENER LAS DIMENSIONES DINAMICAS
  useEffect(() => {
    const fetchFields = async () => {
      const fieldData = await obtenerCampos();
      setCamposDinamicos(fieldData.recordset);

      //Verifica si data es un array
      if (Array.isArray(fieldData.recordset)) {
        setCamposDinamicos(fieldData.recordset);
      } else {
        console.error(
          "Los datos obtenidos no son un array",
          fieldData.recordset
        );
        setCamposDinamicos([]);
      }
      // Inicializa formData con campos vacíos
      const initialData = fieldData.recordset.reduce((acc, field) => {
        acc[field.ColumnName] = "";
        return acc;
      }, {});
      setFormData(initialData);
    };

    fetchFields();
  }, []);

  //OBTENER LOS DATOS PARA LOS SELECTS
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tipoIdRes, sexoRes] = await Promise.all([
          axios.get("http://localhost:81/api/tipo_id"),
          axios.get("http://localhost:81/api/getSexoSelect"),
        ]);

        setTipoIdOptions(tipoIdRes.data.recordset || []);
        setSexoOptions(sexoRes.data.recordset || []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);
  //PARA CUANDO SE CAPTURA UN DATO
  const handleChange = (event) => {
    const { name, value } = event.target;
    // console.log(event.target, event);
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  //GUARDAR LA CONSULTA
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Submitted", formData);
    const apiUrl = "http://localhost:81/api/pacientes/insertarPaciente"; 
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData), // Convertir formData a JSON
    };
    fetch(apiUrl, requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Error en la solicitud');
      }
      return response.json();
    })
    .then((data) => {
      // Aquí puedes manejar la respuesta de la API
      console.log("Respuesta de la API:", data);
      setSnackbarMessage(`Paciente creado exitosamente. ID: ${data.output.ULTIMO}`);
      setOpenSnackbar(true);
    })
    .catch((error) => {
      console.error("Error:", error);
      setSnackbarMessage('Error al crear el paciente');
      setOpenSnackbar(true);
    });
  };
  //PARA LA EDAD Y FECHA NACIMIENTO
  const handleBlur = (event) => {
    const inputAge = event.target.value;

    // Validar que la edad ingresada sea un número positivo
    if (!isNaN(inputAge) && inputAge >= 0) {
      setAge(inputAge);

      // Calcular la fecha de nacimiento basada en la edad ingresada
      if (inputAge) {
        const today = dayjs();
        const birthYear = today.year() - inputAge;
        const calculatedBirthDate = today.year(birthYear).startOf("year");
        setBirthDate(calculatedBirthDate);
      } else {
        setBirthDate(null);
      }
    } else {
      // Resetear fecha de nacimiento si la edad no es válida
      setAge("");
      setBirthDate(null);
    }
  };

  //PARA BUSCAR UN PACIENTE --TODO
  const handleSearch = async () => {
    try {
      // Realizar la llamada a la API para la búsqueda.
      const response = await axios.get("http://localhost:81/api/buscar", {
        params: {
          numeroID: formData.numeroID,
        },
      });

      // Asumiendo que la respuesta de la API tiene una estructura similar a formData
      const searchResult = response.data.recordset[0];

      // Actualiza el estado con los datos devueltos por la API
      setFormData((prevData) => ({
        ...prevData,
        IdTipoIden: searchResult.IdTipoIden || "",
        numeroID: searchResult.numeroID || "",
        primerApellido: searchResult.primerApellido || "",
        segundoApellido: searchResult.segundoApellido || "",
        primerNombre: searchResult.primerNombre || "",
        segundoNombre: searchResult.segundoNombre || "",
        edad: searchResult.edad || "",
        sexo: searchResult.sexo || "",
        date: searchResult.fechaNacimiento
          ? new Date(searchResult.fechaNacimiento)
          : null,
      }));
    } catch (error) {
      console.error("Error in search:", error);
    }
  };

  const [formData, setFormData] = useState(() =>
    camposDinamicos.reduce((acc, field) => {
      acc[field.NOMBRECORTO] = "";
      return acc;
    }, {
      IdTipoIden: "",
      numeroID: "",
      primerApellido: "",
      segundoApellido: "",
      primerNombre: "",
      segundoNombre: "",
      edad: 0,
      fechaNacimiento: null,
      sexo: "",
    })
  );
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };
  // DONDE SE ARMA EL HTML
  return (
    <Container component="main">
      <CssBaseline />
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, "& .MuiTextField-root": { m: 2, width: "100%" } }}>
      <Grid container spacing={8} justifyContent="flex-start" direction="row">
        <Grid item xs={12} sm={6}>
          <Box sx={{ "& .MuiTextField-root": { m: 2, width: "100%" } }}>
          <Typography component="h1" variant="h5">
            Datos Demográficos
          </Typography>
          <FormControl fullWidth margin="normal" size="small">
            <InputLabel id="tipo-id-label">Tipo ID</InputLabel>
            <Select
              labelId="tipo-id-label"
              id="tipo-id"
              name="IdTipoIden"
              value={formData.IdTipoIden}
              onChange={handleChange}
              label="Tipo ID"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {tipoIdOptions.map((option) => (
                <MenuItem
                  key={option.IDTIPOIDENTIFICACION}
                  value={option.IDTIPOIDENTIFICACION}
                >
                  {option.NOMBRE}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {[
            { id: "numeroID", label: "Número ID", requerido: false },
            { id: "primerApellido", label: "Primer Apellido", requerido: true },
            { id: "segundoApellido",label: "Segundo Apellido",requerido: true,},
            { id: "primerNombre", label: "Primer Nombre", requerido: true },
            { id: "segundoNombre", label: "Segundo Nombre", requerido: true },
          ].map((field) => (
            <TextField
              key={field.id}
              id={field.id}
              name={field.id}
              label={field.label}
              variant="standard"
              value={formData[field.id]}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required={!!field.requerido}
              size="small"
            />
          ))}
          <TextField
            key="edad"
            id="edad"
            name="edad"
            label="Edad"
            variant="standard"
            value={edad}
            onChange={handleBlur}
            onBlur={handleChange}
            fullWidth
            margin="normal"
            required
            size="small"
          />

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              key="date"
              label="Fecha Nacimiento"
              value={birthDate}
              onChange={(birthDate) => handleChange({ target: { value: birthDate, name: "fechaNacimiento" },})}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </LocalizationProvider>
          <FormControl fullWidth margin="normal" size="small">
            <InputLabel id="sexo-label">Sexo</InputLabel>
            <Select
              labelId="sexo-label"
              id="sexo"
              name="sexo"
              value={formData.sexo}
              onChange={handleChange}
              label="Sexo"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {sexoOptions.map((option) => (
                <MenuItem key={option.IDSEXO} value={option.IDSEXO}>
                  {option.NOMBRE}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        </Grid>
        <Grid item xs={12} sm={6} justifyContent="flex-start">
            <Box sx={{ "& .MuiTextField-root": { m: 1, width: "100%" } }}>
          <Typography component="h4" variant="h5">
            Dimensiones
          </Typography>

          {camposDinamicos.map((field) => (
            <TextField
              key={field.NOMBRECORTO}
              name={field.NOMBRECORTO}
              label={field.NOMBRE}
              id={"Dimen"+field.ORDEN}
              type="text"
              value={formData[field.NOMBRECORTO] || ""}
              // onChange={handleChange}
              onChange={(e) => handleChange(e)} // Pasando el valor y nombre de la misma manera que con birthDate
              required={field.OBLIGATORIO === true}
              fullWidth
              margin="normal"
              variant="standard"
              size="small"
            />
          ))}
        </Box>
        </Grid>
        </Grid>
        <Stack
          direction="row"
          spacing={2}
          justifyContent="center"
          sx={{ mt: 2 }}
        >
          <Button type="submit" fullWidth variant="contained" size="small">
            Enviar
          </Button>
          <Button type="button" fullWidth variant="contained" size ="small" onClick={handleSearch}>
            Buscar
          </Button>
          {/* Snackbar para mostrar el mensaje */}
          <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert onClose={handleCloseSnackbar} severity="success">
            {snackbarMessage}
          </Alert>
        </Snackbar>
        </Stack>
      </Box>
    </Container>
  );
};

export default IGENPaciente;
