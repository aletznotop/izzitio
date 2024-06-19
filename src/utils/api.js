import axios from "axios";

const API_BASE_URL = "http://localhost:81/api";

export const fetchTipoIdOptions = async (setTipoIdOptions) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/tipo_id`);
    setTipoIdOptions(response.data.recordset || []);
  } catch (error) {
    console.error("Error fetching Tipo ID options:", error);
  }
};

export const fetchSexoOptions = async (setSexoOptions) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getSexoSelect`);
    setSexoOptions(response.data.recordset || []);
  } catch (error) {
    console.error("Error fetching Sexo options:", error);
  }
};

export const insertarPaciente = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/pacientes/insertarPaciente`, formData);
    return response.data;
  } catch (error) {
    throw new Error("Error inserting patient:", error);
  }
};

export const buscarPaciente = async (numeroID) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/buscar`, {
      params: { numeroID },
    });
    return response.data.recordset[0];
  } catch (error) {
    throw new Error("Error searching patient:", error);
  }
};
