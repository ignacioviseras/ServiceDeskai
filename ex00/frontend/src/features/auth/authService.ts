import axios from 'axios';

// axiosIntance -> /api/ + API_BASE users/
const API_BASE = 'http://localhost:5555/api/users/'; 

const login = async (userData: any) => {
    console.log("data", userData);
    console.log("url", API_BASE + 'login');
    const response = await axios.post(API_BASE + 'login', userData); 
    console.log("response", response);
    if (response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data));

    return response.data;
};

const logout = () => {
    localStorage.removeItem('user');
};

const register = async (userData: any) => {
    const response = await axios.post(API_BASE, userData); 

    if (response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data));
    return response.data;
};

const authService = {
    login,
    logout,
    register
};

export default authService;