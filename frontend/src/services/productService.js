import api from './api';

export const productService = {
    getAllProducts: async (page = 1, limit = 12) => {
        const response = await api.get(`/products?page=${page}&limit=${limit}`);
        return response.data;
    },

    getProductById: async (id) => {
        const response = await api.get(`/products/${id}`);
        return response.data;
    },

    placeBid: async (id, amount) => {
        const response = await api.post(`/products/${id}/bid`, { amount });
        return response.data;
    },

    getProductsByCategory: async (categoryId, page = 1, limit = 12) => {
        const response = await api.get(`/products/category/${categoryId}?page=${page}&limit=${limit}`);
        return response.data;
    },

    searchProducts: async (query, page = 1, limit = 12, sort = 'default') => {
        const response = await api.get(`/products/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}&sort=${sort}`);
        return response.data;
    },

    getLatestBiddedProducts: async () => {
        const response = await api.get('/products/latest-bidded');
        return response.data;
    },

    getMostBiddedProducts: async () => {
        const response = await api.get('/products/most-bidded');
        return response.data;
    },

    getHighestPriceProducts: async () => {
        const response = await api.get('/products/highest-price');
        return response.data;
    },

    getCategories: async () => {
        const response = await api.get('/categories');
        return response.data;
    },

    requestBidPermission: async (id) => {
        const response = await api.post(`/products/${id}/bid-request`);
        return response.data;
    },

    checkBidPermission: async (id) => {
        const response = await api.get(`/products/${id}/bid-permission`);
        return response.data;
    }
};
