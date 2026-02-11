import api from './axios';

export const getCustomers = async () => {
    const response = await api.get('/customers/');
    return response.data;
};

export const createCustomer = async (data) => {
    const response = await api.post('/customers/', data);
    return response.data;
};

export const deleteCustomer = async (id) => {
    await api.delete(`/customers/${id}/`);
};
