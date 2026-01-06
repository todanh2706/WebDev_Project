import api from './api';

export const orderService = {
    getOrderByProduct: async (productId) => {
        const response = await api.get(`/orders/product/${productId}`);
        return response.data;
    },

    updateOrderStep: async (orderId, data) => {
        const response = await api.put(`/orders/${orderId}`, data);
        return response.data;
    },

    getMessages: async (orderId) => {
        const response = await api.get(`/orders/${orderId}/messages`);
        return response.data;
    },

    sendMessage: async (orderId, message) => {
        const response = await api.post(`/orders/${orderId}/messages`, { message });
        return response.data;
    }
};
