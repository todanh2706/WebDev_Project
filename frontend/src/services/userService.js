import api from './api';

export const userService = {
    getWonAuctions: async () => {
        const response = await api.get('/user/won');
        return response.data;
    },

    getWatchlist: async () => {
        const response = await api.get('/user/watchlist');
        return response.data;
    },

    getParticipating: async () => {
        const response = await api.get('/user/participating');
        return response.data;
    },

    getRatings: async () => {
        const response = await api.get('/user/ratings');
        return response.data;
    },

    addToWatchlist: async (productId) => {
        const response = await api.post('/user/watchlist', { productId });
        return response.data;
    },

    removeFromWatchlist: async (productId) => {
        const response = await api.delete(`/user/watchlist/${productId}`);
        return response.data;
    },

    submitFeedback: async (feedbackData) => {
        const response = await api.post('/feedbacks', feedbackData);
        return response.data;
    },

    updateProfile: async (profileData) => {
        const response = await api.put('/user/profile', profileData);
        return response.data;
    },

    changePassword: async (passwordData) => {
        const response = await api.put('/user/profile', passwordData);
        return response.data;
    },

    requestUpgrade: async (reason) => {
        const response = await api.post('/user/upgrade-request', { reason });
        return response.data;
    },

    getUpgradeRequest: async () => {
        const response = await api.get('/user/upgrade-request');
        return response.data;
    }
};
