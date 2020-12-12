import axios from 'axios';
import queryString from 'query-string';

const axiosClient = axios.create({
    baseURL: process.env.REACT_APP_api_domain,
    headers: {
        'content-type': 'application/json',
    },
    paramsSerializer: params => queryString.stringify(params)
});

axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    config.headers['Authorization'] = `Bearer ${token}`;
    return config;
}, (err) => {
    Promise.reject(err);
});

axiosClient.interceptors.response.use((response) => {
    if(response && response.data) {
        return response.data;
    }
    return response;
}, (error) => {
    throw error;
});

export default axiosClient;