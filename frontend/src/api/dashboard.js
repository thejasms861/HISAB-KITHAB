import api from './axios';

export const getDashboardStats = async (period = 'weekly') => {
    const response = await api.get('/reports/monthly/', { params: { period } });
    return response.data;
};

export const getRecentTransactions = async () => {
    const response = await api.get('/transactions/?limit=5'); // We'll implement limit in backend or just slice frontend
    return response.data;
};
