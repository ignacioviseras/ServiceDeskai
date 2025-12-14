import axios from 'axios';

const BASE_URL = 'http://localhost:5555/api/'; 

const axiosInstance = axios.create({
    baseURL: BASE_URL, 
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const userJson = localStorage.getItem('user');
        if (userJson) {
            const user = JSON.parse(userJson);
            if (user && user.token) {
                console.log('Token adjuntado a la solicitud.');
                config.headers.Authorization = `Bearer ${user.token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;