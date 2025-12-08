import api from "./api";

const getCategories = async () => {
    try {
        const response = await api.get('/categories');
        return response.data;
    } catch (error) {
        console.error("Error in getCategories service:", error);
        throw error;
    }
};

export const categoriesService = {
    getCategories
};