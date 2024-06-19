import axios from 'axios';

export const obtenerCampos = async () => {
  try {
    const response = await axios.get('http://localhost:81/api/getDimensionesPaciente');
    return response.data;
  } catch (error) {
    console.error('Error al obtener los campos', error);
    return [];
  }
};