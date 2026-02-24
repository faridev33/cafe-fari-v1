import axios from 'axios';

const API_URL = "http://127.0.0.1:8000"; // Sesuaikan port backend

// --- GET ALL USERS ---
export const getUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/users/`);
    // Mapping image URL agar lengkap
    return response.data.map(user => ({
      ...user,
      image: user.image_url ? `${API_URL}/${user.image_url}` : null
    }));
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

// --- GET ONE USER ---
export const getUserById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/users/${id}`);
    const user = response.data;
    return {
      ...user,
      image: user.image_url ? `${API_URL}/${user.image_url}` : null
    };
  } catch (error) {
    throw error;
  }
};

// --- CREATE USER ---
export const createUser = async (userData) => {
  try {
    const formData = new FormData();
    formData.append('username', userData.username);
    formData.append('password', userData.password); // Wajib saat create
    formData.append('role', userData.role);

    if (userData.image instanceof File) {
      formData.append('image', userData.image);
    }

    const response = await axios.post(`${API_URL}/users/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// --- UPDATE USER ---
export const updateUser = async (id, userData) => {
  try {
    const formData = new FormData();
    formData.append('username', userData.username);
    formData.append('role', userData.role);

    // Kirim password HANYA JIKA diisi (untuk ganti password)
    if (userData.password) {
      formData.append('password', userData.password);
    }

    if (userData.image instanceof File) {
      formData.append('image', userData.image);
    }

    const response = await axios.put(`${API_URL}/users/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// --- DELETE USER ---
export const deleteUser = async (id) => {
  try {
    await axios.delete(`${API_URL}/users/${id}`);
  } catch (error) {
    throw error;
  }
};