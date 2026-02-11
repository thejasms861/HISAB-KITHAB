import api from './axios';

export const getTransactions = async (params = {}) => {
    const response = await api.get('/transactions/', { params });
    return response.data;
};

export const createTransaction = async (data) => {
    const response = await api.post('/transactions/', data);
    return response.data;
};
