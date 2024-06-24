import React from "react";
import { Box, Typography, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from "dayjs";

const DatosDemograficos = ({ formData, tipoIdOptions, sexoOptions, onChange, onBlur }) => (
  <Box sx={{ "& .MuiTextField-root": { m: 2, width: "100%" } }}>
    <Typography component="h1" variant="h5">Datos Demográficos</Typography>
    <FormControl fullWidth margin="normal" size="small">
      <InputLabel id="tipo-id-label">Tipo ID</InputLabel>
      <Select
        labelId="tipo-id-label"
        id="tipo-id"
        name="IDTIPOIDENTIFICACION"
        value={formData.IDTIPOIDENTIFICACION}
        onChange={onChange}
        label="Tipo ID"
      >
        <MenuItem value="0"><em>None</em></MenuItem>
        {tipoIdOptions.map((option) => (
          <MenuItem key={option.IDTIPOIDENTIFICACION} value={option.IDTIPOIDENTIFICACION}>{option.NOMBRE}</MenuItem>
        ))}
      </Select>
    </FormControl>
    {["NUMEROIDENTIFICACION", "APELLIDO1", "APELLIDO2", "NOMBRE1", "NOMBRE2","SEXOBIOLOGICO"].map((field, index) => (
      <TextField
        key={field}
        id={field}
        name={field}
        label={field.replace(/([A-Z])/g, ' $1')}
        variant="outlined"
        value={formData[field]}
        onChange={onChange}
        fullWidth
        margin="normal"
        required={index !== 0} // Solo `numeroID` no es requerido
        size="small"
      />
    ))}
    <TextField
      key="EDAD"
      id="EDAD"
      name="EDAD"
      label="Edad"
      variant="standard"
      value={formData.EDAD}
      onChange={onChange}
      onBlur={onBlur}
      fullWidth
      margin="normal"
      required
      size="small"
    />
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label="Fecha Nacimiento"
        name="FECHANACIMIENTO"
        value={formData.FECHANACIMIENTO1 || dayjs()}
        onChange={(date) => onChange({ target: { value: date, name: "FECHANACIMIENTO1" } })}
        renderInput={(params) => <TextField {...params} fullWidth />}
      />
    </LocalizationProvider>
    <FormControl fullWidth margin="normal" size="small">
      <InputLabel id="sexo-label">Sexo</InputLabel>
      <Select
        labelId="sexo-label"
        id="IDSEXO"
        name="IDSEXO"
        value={formData.IDSEXO}
        onChange={onChange}
        label="Sexo"
      >
        <MenuItem value="0"><em>None</em></MenuItem>
        {sexoOptions.map((option) => (
          <MenuItem key={option.IDSEXO} value={option.IDSEXO}>{option.NOMBRE}</MenuItem>
        ))}
      </Select>
    </FormControl>
  </Box>
);

export default DatosDemograficos;
