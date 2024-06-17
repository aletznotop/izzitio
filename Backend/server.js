// backend/server.js
require("dotenv").config();
const express = require("express");
const sql = require("mssql");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 81;

app.use(cors());
app.use(express.json());

// Configuración de la base de datos
const dbConfig = {
  user: "usrAthenea",
  password: "usrAthenea",
  server: "s26.cogniti.com.mx",
  database: "cogniti_ammtac2023",
  options: {
    encrypt: false,
  },
};

// Conexión a la base de datos
let pool;
sql
  .connect(dbConfig)
  .then((connectedPool) => {
    pool = connectedPool;
    console.log("Conectado a SQL Server");
  })
  .catch((err) => {
    console.error("Error al conectar a SQL Server:", err);
  });

app.get("/api/pacientes/buscaTodo", async (req, res) => {
  try {
    const result = await pool
      .request()
      .query("SELECT * FROM GENERAL.TB_PACIENTES");
    res.json(result.recordset);
  } catch (err) {
    console.error("Error al obtener los tipos de servicios:", err);
    res.status(500).send("Error en el servidor");
  }
});

app.post("/api/pacientes/insertarPaciente", async (req, res) => {
  const {
    INIDPACIENTE,
    INIDTIPOIDENTIFICACION,
    INNUMEROIDENTIFICACION,
    INFECHANACIMIENTO,
    INNOMBRE1,
    INNOMBRE2,
    INAPELLIDO1,
    INAPELLIDO2,
    INIDSEXO,
    INIDENTIDAD,
    INIDPLAN,
    INACTIVO,
    IND0,
    IND1,
    IND2,
    IND3,
    IND4,
    IND5,
    IND6,
    IND7,
    IND8,
    IND9,
  } = req.query;

  // Convertir y validar tipos de datos
  const idPaciente = parseInt(INIDPACIENTE) || 0;
  const idTipoIdentificacion = parseInt(INIDTIPOIDENTIFICACION) || 0;
  const idSexo = parseInt(INIDSEXO) || 0;
  const identidad = parseInt(INIDENTIDAD) || 0;
  const idPlan = parseInt(INIDPLAN) || 0;
  const activo = INACTIVO ? 1 : 0;

  try {
    await pool
      .request()
      .input("INIDPACIENTE", sql.Int, idPaciente)
      .input("INIDTIPOIDENTIFICACION", sql.SmallInt, idTipoIdentificacion)
      .input("INNUMEROIDENTIFICACION", sql.VarChar(20), INNUMEROIDENTIFICACION || "")
      .input("INFECHANACIMIENTO", sql.DateTime, INFECHANACIMIENTO ? new Date(INFECHANACIMIENTO) : null)
      .input("INNOMBRE1", sql.VarChar(50), INNOMBRE1 || "")
      .input("INNOMBRE2", sql.VarChar(50), INNOMBRE2 || "")
      .input("INAPELLIDO1", sql.VarChar(50), INAPELLIDO1 || "")
      .input("INAPELLIDO2", sql.VarChar(50), INAPELLIDO2 || "")
      .input("INIDSEXO", sql.SmallInt, idSexo)
      .input("INIDENTIDAD", sql.Int, identidad)
      .input("INIDPLAN", sql.Int, idPlan)
      .input("INACTIVO", sql.Bit, activo)
      .input("IND0", sql.VarChar(sql.MAX), IND0 || "")
      .input("IND1", sql.VarChar(sql.MAX), IND1 || "")
      .input("IND2", sql.VarChar(sql.MAX), IND2 || "")
      .input("IND3", sql.VarChar(sql.MAX), IND3 || "")
      .input("IND4", sql.VarChar(sql.MAX), IND4 || "")
      .input("IND5", sql.VarChar(sql.MAX), IND5 || "")
      .input("IND6", sql.VarChar(sql.MAX), IND6 || "")
      .input("IND7", sql.VarChar(sql.MAX), IND7 || "")
      .input("IND8", sql.VarChar(sql.MAX), IND8 || "")
      .input("IND9", sql.VarChar(sql.MAX), IND9 || "")
      .output("MENSAJE", sql.VarChar(200))
      .output("ULTIMO", sql.Int)
      .execute("GENERAL.SSP_INSPACIENTE");

    res.status(201).send("Se ha guardado el Paciente/Donante");
  } catch (err) {
    console.error("Error al insertar:", err);
    res.status(500).send("Error en el servidor");
  }
});


app.get("/api/pacientes/getPacientesCriterios", async (req, res) => {
  // const { INNOMBRE1, INNOMBRE2, INAPELLIDO1, INAPELLIDO2, INIDSEXO } = req.params; //COMO PARAMETROS
  const { INNOMBRE1, INNOMBRE2, INAPELLIDO1, INAPELLIDO2, INIDSEXO } =
    req.query; //PARA RECUPERAR EN LA QUERY STRING COMO VB

  try {
    const result = await pool
      .request()
      .input("INNOMBRE1", sql.NVarChar, INNOMBRE1 || "")
      .input("INNOMBRE2", sql.NVarChar, INNOMBRE2 || "")
      .input("INAPELLIDO1", sql.NVarChar, INAPELLIDO1 || "")
      .input("INAPELLIDO2", sql.NVarChar, INAPELLIDO2 || "")
      .input("INIDSEXO", sql.NVarChar, INIDSEXO || "")
      .execute("[GENERAL].[SSP_GETPACIENTESCOINCIDENTES]");

    res.json(result.recordset);
  } catch (err) {
    console.error("Error al obtener los servicios:", err);
    res.status(500).send("Error en el servidor");
  }
});

app.get("/api/pacientes/:idPaciente", async (req, res) => {
  const { idPaciente } = req.params;

  try {
    const result = await pool
      .request()
      .input("INIDPACIENTE", sql.NVarChar, idPaciente || "")
      .execute("GENERAL.SSP_GETPACIENTEBYID");
    res.json(result.recordset);
  } catch (err) {
    console.error("Error en la consulta:", err);
    res.status(500).send("Error en el servidor");
  }
});

app.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
