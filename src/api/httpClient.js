import axios from 'axios';
import { configuration } from '../config';

export const client = {
    get(url) {
        return request('get', url);
    },
    post(url, data) {
        return request('post', url, data);
    },
    put(url, data) {
        return request('put', url, data);
    },
    delete(url) {
        return request('delete', url);
    }
};

const axiosInstance = axios.create();

const request = (method, url, data) => {
    const response = axiosInstance.request({
        method: method,
        url: url,
        data: data
    });
    return response;
};

axiosInstance.interceptors.request.use(
    (config) => {
        const authToken = localStorage.getItem(configuration.authTokenKey);
        if (authToken !== null) {
            config.headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authToken,
                'Accept': 'application/json'
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    });

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config,
              savedRefreshToken = localStorage.getItem(configuration.refreshTokenKey),
              savedUser = localStorage.getItem(configuration.authUserKey);
        if (error.response && error.response.status === 401 && 
                savedRefreshToken && savedUser && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const { token, refreshToken } = await requestRefreshToken(savedRefreshToken, savedUser);
                localStorage.setItem(configuration.authTokenKey, token);
                localStorage.setItem(configuration.refreshTokenKey, refreshToken);
                return axiosInstance(originalRequest);
            } catch (e) {
            }
        }
        return Promise.reject(error);
    });

const requestRefreshToken = async (token, username) => {
    const refreshTokenUrl = configuration.baseUrl + configuration.paths.auth.refreshToken.url;
    const result = await axios.post(refreshTokenUrl, {
        refreshToken: token,
        login: username
    });
    return result.data;
};