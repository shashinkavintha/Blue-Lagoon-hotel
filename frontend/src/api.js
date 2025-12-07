import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://blue-lagoon-hotel.onrender.com/api',
});

// Add a request interceptor to add the JWT token to headers
api.interceptors.request.use(
    (config) => {
        // Skip adding Authorization header for public booking endpoint
        if (config.url && config.url.includes('/bookings') && config.method === 'post') {
            console.log("API Interceptor - Skipping auth header for public booking endpoint");
            return config;
        }

        // We stick to 'token' to maintain compatibility with existing Login/Navbar components
        const token = localStorage.getItem('token');

        console.log("API Interceptor - Token from storage:", token ? "FOUND" : "MISSING");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            // console.log("API Interceptor - Header set:", config.headers.Authorization);
        } else {
            console.log("API Interceptor - No token found, sending request without auth");
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
