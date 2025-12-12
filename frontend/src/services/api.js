import axios from 'axios';

// Asegúrate de que esta ruta sea la correcta a tu carpeta backend
const API_URL = 'http://localhost/FitoScentsWEB/routes';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const inventarioService = {
    // Obtener todos los perfumes
    obtenerPerfumes: async () => {
        try {
            // CORREGIDO: obtenerPerfumes.php (coincide con tu foto)
            const response = await api.get('/obtenerPerfumes.php'); 
            return response.data;
        } catch (error) {
            console.error("Error al obtener perfumes:", error);
            return { records: [] };
        }
    },

    // Guardar un nuevo perfume
    guardarPerfume: async (datosPerfume) => {
        try {
            // CORREGIDO: guardarPerfume.php
            const response = await api.post('/guardarPerfume.php', datosPerfume);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Obtener marcas
    obtenerMarcas: async () => {
        try {
            // CORREGIDO: obtenerMarca.php (según tu foto es singular)
            const response = await api.get('/obtenerMarca.php');
            return response.data;
        } catch (error) {
            console.error("Error al obtener marcas:", error);
            return { records: [] };
        }
    },

    // Guardar nueva marca
    guardarMarca: async (nombreMarca) => {
        try {
            // CORREGIDO: guardarMarca.php
            const response = await api.post('/guardarMarca.php', { nombreMarca });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default api;