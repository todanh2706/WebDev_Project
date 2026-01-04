import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to attach the token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Add a response interceptor to handle session expiration
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            if (error.response.status === 401) {
                window.dispatchEvent(new CustomEvent('auth:session-expired'));
            }
            else if (error.response.status === 403) {
                const errorMessage = error.response.data?.message || "";
                if (!errorMessage.includes("banned")) {
                    window.dispatchEvent(new CustomEvent('auth:session-expired'));
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;
