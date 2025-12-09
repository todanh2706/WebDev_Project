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

    requestBidPermission: async (productId) => {
        const response = await api.post(`/products/${productId}/bid-request`);
        return response.data;
    },

    checkBidPermission: async (productId) => {
        const response = await api.get(`/products/${productId}/bid-permission`);
        return response.data;
    },

    getBidRequests: async (productId = null) => {
        let url = '/seller/bid-requests';
        if (productId) {
            url += `?productId=${productId}`;
        }
        const response = await api.get(url);
        return response.data;
    },

    handleBidRequest: async (requestId, status) => {
        const response = await api.put(`/seller/bid-requests/${requestId}`, { status });
        return response.data;
    },

    createProduct: async (formData) => {
        const response = await api.post('/products', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },
    getMyProducts: async (page = 1, limit = 12) => {
        const response = await api.get(`/user/my-products?page=${page}&limit=${limit}`);
        return response.data;
    },
    appendDescription: async (id, description) => {
        const response = await api.post(`/products/${id}/description`, { description });
        return response.data;
    }
};
