import axios from 'axios';

const API_URL = 'http://localhost/FitoScentsWEB/backend/routes';

const api = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' }
});

export const inventarioService = {
    // --- PERFUMES ---
    obtenerPerfumes: async () => {
        try {
            const response = await api.get('/obtenerPerfumes.php'); 
            return response.data;
        } catch (error) {
            return { records: [] };
        }
    },

    guardarPerfume: async (datosPerfume) => {
        try {
            const response = await api.post('/guardarPerfume.php', datosPerfume);
            return response.data;
        } catch (error) { throw error; }
    },

    // NUEVO: Editar
    editarPerfume: async (datosPerfume) => {
        try {
            const response = await api.post('/editarPerfume.php', datosPerfume);
            return response.data;
        } catch (error) { throw error; }
    },

    // NUEVO: Borrar
    borrarPerfume: async (idPerfume) => {
        try {
            const response = await api.post('/borrarPerfume.php', { idPerfume });
            return response.data;
        } catch (error) { throw error; }
    },

    // --- MARCAS ---
    obtenerMarcas: async () => {
        try {
            const response = await api.get('/obtenerMarca.php');
            return response.data;
        } catch (error) { return { records: [] }; }
    },

    guardarMarca: async (nombreMarca) => {
        try {
            const response = await api.post('/guardarMarca.php', { nombreMarca });
            return response.data;
        } catch (error) { throw error; }
    },

    // --- INSUMOS Y VENTAS ---
    obtenerInsumos: async () => {
        try {
            const response = await api.get('/obtenerInsumo.php');
            return response.data;
        } catch (error) { return { records: [] }; }
    },

    guardarInsumo: async (datosInsumo) => {
        try {
            const response = await api.post('/guardarInsumo.php', datosInsumo);
            return response.data;
        } catch (error) { throw error; }
    },

    guardarVenta: async (datosVenta) => {
        try {
            const response = await api.post('/guardarVenta.php', datosVenta);
            return response.data;
        } catch (error) { throw error; }
    },
    // --- CLIENTES ---
    obtenerClientes: async () => {
        try {
            const response = await api.get('/obtenerClientes.php');
            return response.data;
        } catch (error) { return { records: [] }; }
    },

    guardarCliente: async (datosCliente) => {
        try {
            const response = await api.post('/guardarCliente.php', datosCliente);
            return response.data;
        } catch (error) { throw error; }
    }
};

export default api;