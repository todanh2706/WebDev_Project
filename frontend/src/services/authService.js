import api from './api';

export const authService = {
    login: async (email, password) => {
        const response = await api.post('/login', { email, password });
        return response.data;
    },

    register: async (userData) => {
        const response = await api.post('/register', userData);
        return response.data;
    },

    verifyOTP: async (email, otp) => {
        const response = await api.post('/verify-otp', { email, otp });
        return response.data;
    },

    refreshToken: async () => {
        const response = await api.post('/refresh');
        return response.data;
    },

    logout: async () => {
        const response = await api.post('/logout');
        return response.data;
    },

    getProfile: async () => {
        const response = await api.get('/user/profile');
        return response.data;
    }
};
