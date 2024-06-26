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
  user: process.env.REACT_APP_DB_USER,
  password: process.env.REACT_APP_DB_PASSWORD,
  server: process.env.REACT_APP_DB_SERVER,
  database: process.env.REACT_APP_DB_DATABASE,
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
  const idPaciente = parseInt(req.body.IDPACIENTE) || 0;
  const idTipoIdentificacion = parseInt(req.body.IDTIPOIDENTIFICACION) || 0;
  const idSexo = parseInt(req.body.IDSEXO) || 0;
  const identidad =  0;
  const idPlan = 0;
  const activo = 1;
  console.log(`Executing stored procedure: INSERTA PACIENTE`);
  console.log(req.body.FECHANACIMIENTO);
  console.log(req.body.IDTIPOIDENTIFICACION);
  try {
    const result = await pool
      .request()
      .input("INIDPACIENTE", sql.Int, idPaciente)
      .input("INIDTIPOIDENTIFICACION", sql.SmallInt, idTipoIdentificacion)
      .input("INNUMEROIDENTIFICACION", sql.VarChar(20), identidad || "")
      .input("INFECHANACIMIENTO", sql.DateTime, req.body.FECHANACIMIENTO ? new Date(req.body.FECHANACIMIENTO) : null)
      .input("INNOMBRE1", sql.VarChar(50), req.body.NOMBRE1 || "")
      .input("INNOMBRE2", sql.VarChar(50), req.body.NOMBRE2 || "")
      .input("INAPELLIDO1", sql.VarChar(50), req.body.APELLIDO1 || "")
      .input("INAPELLIDO2", sql.VarChar(50), req.body.APELLIDO2 || "")
      .input("INIDSEXO", sql.SmallInt, idSexo)
      .input("INIDENTIDAD", sql.Int, identidad)
      .input("INIDPLAN", sql.Int, idPlan)
      .input("INACTIVO", sql.Bit, activo)
      .input("IND0", sql.VarChar(sql.MAX), req.body.D0)
      .input("IND1", sql.VarChar(sql.MAX), req.body.D1)
      .input("IND2", sql.VarChar(sql.MAX), req.body.D2)
      .input("IND3", sql.VarChar(sql.MAX), req.body.D3)
      .input("IND4", sql.VarChar(sql.MAX), req.body.D4)
      .input("IND5", sql.VarChar(sql.MAX), req.body.D5)
      .input("IND6", sql.VarChar(sql.MAX), req.body.D6)
      .input("IND7", sql.VarChar(sql.MAX), req.body.D7)
      .input("IND8", sql.VarChar(sql.MAX), req.body.D8)
      .input("IND9", sql.VarChar(sql.MAX), req.body.D9)
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
console.log(req.params);
console.log(idPaciente);
  try {
    const result = await pool
      .request()
      .input("INIDPACIENTE", sql.Int, idPaciente || "")
      .execute("GENERAL.SSP_GETPACIENTEBYID");
    res.json(result.recordset);
    console.log(result);
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

app.get('/api/Login', async(req,res)=>{
try {
  const ssp = 'SEGURIDAD.SSP_VALIDAACCESO';
  const user = req.query.usuario;
  const password = req.query.pass;
  console.log('Ejecutando:'+ssp);
  console.log(user,password);
  const result = await pool.request().input("INIDUSUARIO",sql.VarChar,user).output("MENSAJE",sql.VarChar(200)).execute(ssp);
  console.log(result);
  res.json(result.recordset);
} catch (error) {
  console.error("Error en la consulta:", error);
    res.status(500).send("Error en el servidor");
}
});

app.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
