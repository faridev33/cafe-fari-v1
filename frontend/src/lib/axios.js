import axios from 'axios';

// Ganti URL sesuai backend Anda
const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000', 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;