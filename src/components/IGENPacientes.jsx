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
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import axios from "axios";
import dayjs from "dayjs";


const IGENPaciente = () => {
  const [formData, setFormData] = useState({
    fechaNacimiento: null,
    IdTipoIden: "",
    numeroID: "",
    primerApellido: "",
    segundoApellido: "",
    primerNombre: "",
    segundoNombre: "",
    edad: 0,
    sexo: "",
  });

  const [tipoIdOptions, setTipoIdOptions] = useState([]);
  const [sexoOptions, setSexoOptions] = useState([]);
  const [edad, setAge] = useState("");
  const [birthDate, setBirthDate] = useState(null);

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

  const handleChange = (event) => {
    const { name, value } = event.target;
    console.log(event);
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Submitted", formData);
    // Aquí puedes realizar la lógica para enviar los datos.
  };
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
        date: searchResult.fechaNacimiento ? new Date(searchResult.fechaNacimiento) : null,
      }));
    } catch (error) {
      console.error("Error in search:", error);
    }
  };
  
      // DONDE SE ARMA EL HTML
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          mt: 3,
          "& .MuiTextField-root": { m: 2, width: "100%" },
        }}
      >
        <Typography component="h1" variant="h5">
          Datos Demográficos
        </Typography>
        <FormControl fullWidth margin="normal">
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
          { id: "numeroID", label: "Número ID", requerido:false },
          { id: "primerApellido", label: "Primer Apellido", requerido:true},
          { id: "segundoApellido", label: "Segundo Apellido", requerido:true },
          { id: "primerNombre", label: "Primer Nombre", requerido:true },
          { id: "segundoNombre", label: "Segundo Nombre", requerido:true },
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
          />
        ))}
        <TextField key="edad" id="edad" name="edad" label="Edad" variant="standard" value={edad} onChange={handleBlur}  onBlur={handleChange} fullWidth margin="normal" required/>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            key="date"
            label="Fecha Nacimiento"
            value={birthDate}
            onChange={birthDate => handleChange({target: {value:birthDate,name:'fechaNacimiento'}})}
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
        </LocalizationProvider>
        <FormControl fullWidth margin="normal">
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
              <MenuItem
                key={option.IDSEXO}
                value={option.IDSEXO}
              >
                {option.NOMBRE}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 2 }}>
          <Button
            type="submit"
            fullWidth
            variant="contained"
          >
            Enviar
          </Button>
          <Button
            type="button"
            fullWidth
            variant="contained"
            onClick={handleSearch}
          >
            Buscar
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default IGENPaciente;
