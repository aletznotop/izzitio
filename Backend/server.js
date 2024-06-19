require('dotenv').config()
const express = require("express");
const sql = require("mssql");
const cors = require("cors");

const app = express();
const port = process.env.REACT_APP_PORT || 81;
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
  // const {
  //   IdTipoIden,
  //   numeroID,
  //   primerApellido,
  //   segundoApellido,
  //   primerNombre,
  //   segundoNombre,
  //   edad,
  //   fechaNacimiento,
  //   sexo
  // } = req.query;

  // Convertir y validar tipos de datos
  const idPaciente = parseInt(req.body.numeroID) || 0;
  const idTipoIdentificacion = parseInt(req.body.IdTipoIden) || 0;
  const idSexo = parseInt(req.body.sexo) || 0;
  const identidad =  0;
  const idPlan = 0;
  const activo = 1;
  console.log(`Executing stored procedure: INSERTA PACIENTE`);
  console.log(req.body.fechaNacimiento);
  console.log(req.body.IdTipoIden);
  try {
    const result = await pool
      .request()
      .input("INIDPACIENTE", sql.Int, idPaciente)
      .input("INIDTIPOIDENTIFICACION", sql.SmallInt, idTipoIdentificacion)
      .input("INNUMEROIDENTIFICACION", sql.VarChar(20), identidad || "")
      .input("INFECHANACIMIENTO", sql.DateTime, req.body.fechaNacimiento ? new Date(req.body.fechaNacimiento) : null)
      .input("INNOMBRE1", sql.VarChar(50), req.body.primerNombre || "")
      .input("INNOMBRE2", sql.VarChar(50), req.body.segundoNombre || "")
      .input("INAPELLIDO1", sql.VarChar(50), req.body.primerApellido || "")
      .input("INAPELLIDO2", sql.VarChar(50), req.body.segundoApellido || "")
      .input("INIDSEXO", sql.SmallInt, idSexo)
      .input("INIDENTIDAD", sql.Int, identidad)
      .input("INIDPLAN", sql.Int, idPlan)
      .input("INACTIVO", sql.Bit, activo)
      .input("IND0", sql.VarChar(sql.MAX), "")
      .input("IND1", sql.VarChar(sql.MAX), "")
      .input("IND2", sql.VarChar(sql.MAX), "")
      .input("IND3", sql.VarChar(sql.MAX), "")
      .input("IND4", sql.VarChar(sql.MAX), "")
      .input("IND5", sql.VarChar(sql.MAX), "")
      .input("IND6", sql.VarChar(sql.MAX), "")
      .input("IND7", sql.VarChar(sql.MAX), "")
      .input("IND8", sql.VarChar(sql.MAX), "")
      .input("IND9", sql.VarChar(sql.MAX), "")
      .output("MENSAJE", sql.VarChar(200))
      .output("ULTIMO", sql.Int)
      .execute("GENERAL.SSP_INSPACIENTE");

    res.status(200).send(result);
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
//Obtener los Tipos de Identificación
app.get('/api/tipo_id', async (req, res) => {
  try {
    const procedureName = 'GENERAL.SSP_GETTIPOSIDENTIFICACION'; // Replace with your stored procedure name
    console.log(`Executing stored procedure: ${procedureName}`);
    const result = await pool.request()
     .execute(procedureName);
    console.log(`Stored procedure result: ${JSON.stringify(result)}`);
    res.json(result);
  } catch (error) {
    console.error(`Error executing stored procedure: ${error.message}`);
    console.error(error.stack);
    res.status(500).send('Error en el Servidor');
  }
});

app.get('/api/getSexoSelect', async (req, res) => {
  try {
    const procedureName = 'GENERAL.SSP_GETSEXOPACIENTE'; // Replace with your stored procedure name
    console.log(`Executing stored procedure: ${procedureName}`);
    const result = await pool.request()
     .execute(procedureName);
    console.log(`Stored procedure result: ${JSON.stringify(result)}`);
    res.json(result);
  } catch (error) {
    console.error(`Error executing stored procedure: ${error.message}`);
    console.error(error.stack);
    res.status(500).send('Error en el Servidor');
  }
});

app.get('/api/getDimensionesPaciente', async (req, res) => {
  try {
    const procedureName = 'GENERAL.SSP_GETDIMENSIONESPACIENTE'; // Replace with your stored procedure name
    console.log(`Executing stored procedure: ${procedureName}`);
    const result = await pool.request()
     .execute(procedureName);
    console.log(`Stored procedure result: ${JSON.stringify(result)}`);
    res.json(result);
  } catch (error) {
    console.error(`Error executing stored procedure: ${error.message}`);
    console.error(error.stack);
    res.status(500).send('Error en el Servidor '+error.stack);
  }
});

app.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
