import React from "react";
import { Box, Typography, TextField } from "@mui/material";

const CamposDinamicos = ({ campos, formData, onChange }) => (
  <Box sx={{ "& .MuiTextField-root": { m: 1, width: "100%" } }}>
    <Typography component="h4" variant="h5">Dimensiones</Typography>
    {campos.map((field) => (
      <TextField
        key={field.NOMBRECORTO}
        name={field.NOMBRECORTO}
        label={field.NOMBRE}
        id={"Dimen" + field.ORDEN}
        type="text"
        value={formData[field.NOMBRECORTO] || ""}
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