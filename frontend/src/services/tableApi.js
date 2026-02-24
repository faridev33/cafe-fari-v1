import axios from 'axios';

const API_URL = "http://127.0.0.1:8000";

export const getTables = async () => {
    const response = await axios.get(`${API_URL}/tables/`);
    return response.data;
};

export const createTable = async (data) => {
    const response = await axios.post(`${API_URL}/tables/`, data);
    return response.data;
};

export const deleteTable = async (id) => {
    await axios.delete(`${API_URL}/tables/${id}`);
};

export const updateTableStatus = async (id, status) => {
    await axios.put(`${API_URL}/tables/${id}/status?status=${status}`);
};