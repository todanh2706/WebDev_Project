import api from './api';

export const adminService = {
    getAllUsers: async (page = 1, limit = 12) => {
        const response = await api.get(`/admin/users?page=${page}&limit=${limit}`);
        return response.data;
    },

    deleteUser: async (userId) => {
        const response = await api.delete(`/admin/users/${userId}`);
        return response.data;
    },

    getUserDetails: async (userId) => {
        const response = await api.get(`/admin/users/${userId}`);
        return response.data;
    },

    getUpgradeRequests: async (page = 1, limit = 12) => {
        const response = await api.get(`/admin/upgrade-requests?page=${page}&limit=${limit}`);
        return response.data;
    },

    approveUpgradeRequest: async (requestId) => {
        const response = await api.post(`/admin/upgrade-requests/${requestId}/approve`);
        return response.data;
    },

    rejectUpgradeRequest: async (requestId) => {
        const response = await api.post(`/admin/upgrade-requests/${requestId}/reject`);
        return response.data;
    },

    deleteProduct: async (productId) => {
        const response = await api.delete(`/admin/products/${productId}`);
        return response.data;
    }
};
