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
            const response = await api.get('/obtenerInsumos.php');
            return response.data;
        } catch (error) { return { records: [] }; }
    },

    guardarInsumo: async (datosInsumo) => {
        try {
            const response = await api.post('/guardarInsumos.php', datosInsumo);
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
    },

    // --- GASTOS ---
    obtenerGastos: async () => {
        try {
            const response = await api.get('/obtenerGastos.php');
            return response.data;
        } catch (error) { return { records: [] }; }
    },

    guardarGasto: async (datosGasto) => {
        try {
            const response = await api.post('/guardarGasto.php', datosGasto);
            return response.data;
        } catch (error) { throw error; }
    },

    obtenerFinanzas: async () => {
        try {
            const response = await api.get('/obtenerFinanzas.php');
            return response.data;
        } catch (error) { return { totalVentas: 0, totalGastos: 0, deudaSocio: 0 }; }
    },

    liquidarSocio: async (datosPago) => {
        try {
            const response = await api.post('/liquidarSocio.php', datosPago);
            return response.data;
        } catch (error) { throw error; }
    }
};

export default api;