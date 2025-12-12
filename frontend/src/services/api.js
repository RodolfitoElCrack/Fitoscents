import axios from 'axios';

// Asegúrate que esta ruta coincida con tu carpeta backend
const API_URL = 'http://localhost/FitoScentsWEB/backend/routes';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const inventarioService = {
    // --- PERFUMES ---
    obtenerPerfumes: async () => {
        try {
            const response = await api.get('/obtenerPerfumes.php'); 
            return response.data;
        } catch (error) {
            console.error("Error al obtener perfumes:", error);
            return { records: [] };
        }
    },

    guardarPerfume: async (datosPerfume) => {
        try {
            const response = await api.post('/guardarPerfume.php', datosPerfume);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // --- MARCAS ---
    obtenerMarcas: async () => {
        try {
            const response = await api.get('/obtenerMarca.php');
            return response.data;
        } catch (error) {
            console.error("Error al obtener marcas:", error);
            return { records: [] };
        }
    },

    guardarMarca: async (nombreMarca) => {
        try {
            const response = await api.post('/guardarMarca.php', { nombreMarca });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // --- INSUMOS (BOTELLAS) ---
    obtenerInsumos: async () => {
        try {
            const response = await api.get('/obtenerInsumos.php');
            return response.data;
        } catch (error) {
            console.error("Error al obtener insumos:", error);
            return { records: [] };
        }
    },

    guardarInsumo: async (datosInsumo) => {
        try {
            const response = await api.post('/guardarInsumo.php', datosInsumo);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default api;