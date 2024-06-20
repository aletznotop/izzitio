import React from "react";
import { Box, Typography, TextField } from "@mui/material";

const CamposDinamicos = ({ campos, formData, onChange }) => (
  <Box sx={{ "& .MuiTextField-root": { m: 1, width: "100%" } }}>
    <Typography component="h4" variant="h5">Dimensiones</Typography>
    {campos.map((field) => (
      <TextField
        key={"D" + field.ORDEN}
        name={"D" + field.ORDEN}
        label={field.NOMBRE}
        id={"D" + field.ORDEN}
        type="text"
        value={formData["D" + field.ORDEN]}
        onChange={onChange}
        required={field.OBLIGATORIO === true}
        fullWidth
        margin="normal"
        variant="standard"
        size="small"
      />
    ))}
  </Box>
);

export default CamposDinamicos;