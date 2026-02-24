import axios from 'axios';

const API_URL = "http://127.0.0.1:8000";

// --- GET ALL PRODUCTS ---
export const getProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/products/`);
    
    // Mapping image URL agar lengkap (http://localhost:8000/static/...)
    const data = response.data.map(item => ({
        ...item,
        image: item.image_url ? `${API_URL}/${item.image_url}` : null
    }));
    
    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// --- GET PRODUCT BY ID ---
export const getProductById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/products/${id}`);
    const item = response.data;
    return {
        ...item,
        image: item.image_url ? `${API_URL}/${item.image_url}` : null
    };
  } catch (error) { throw error; }
};

// --- CREATE PRODUCT ---
export const createProduct = async (productData) => {
  try {
    const formData = new FormData();
    formData.append('name', productData.name);
    formData.append('category', productData.category);
    formData.append('status', productData.status);
    
    // Hapus format rupiah (Rp dan titik) agar jadi angka murni
    const cleanPrice = String(productData.price).replace(/[^0-9]/g, '');
    formData.append('price', cleanPrice);

    if (productData.image instanceof File) {
      formData.append('image', productData.image);
    }

    const response = await axios.post(`${API_URL}/products/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) { throw error; }
};

// --- UPDATE PRODUCT (FULL EDIT) ---
export const updateProduct = async (id, productData) => {
  try {
    const formData = new FormData();
    formData.append('name', productData.name);
    formData.append('category', productData.category);
    formData.append('status', productData.status);
    
    const cleanPrice = String(productData.price).replace(/[^0-9]/g, '');
    formData.append('price', cleanPrice);

    if (productData.image instanceof File) {
      formData.append('image', productData.image);
    }

    const response = await axios.put(`${API_URL}/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error("Gagal update produk:", error);
    throw error;
  }
};

// --- DELETE PRODUCT ---
export const deleteProduct = async (id) => {
  try {
    await axios.delete(`${API_URL}/products/${id}`);
  } catch (error) {
    console.error("Gagal menghapus produk:", error);
    throw error;
  }
};

// --- PRODUCT OPTIONS (OPSI TAMBAHAN SEPERTI TOPPING) ---
export const getProductOptions = async (productId) => {
    try {
        const response = await axios.get(`${API_URL}/options/${productId}`);
        return response.data;
    } catch (error) {
        console.error("Gagal ambil opsi:", error);
        throw error;
    }
};

export const saveProductOptions = async (productId, optionsData) => {
    // optionsData format: [{ name: "Topping", choices: [{name: "Keju", extra_price: 2000}] }]
    try {
        await axios.post(`${API_URL}/options/${productId}`, optionsData);
    } catch (error) {
        console.error("Gagal simpan opsi:", error);
        throw error;
    }
};

// --- UPDATE STATUS SAJA (KHUSUS KITCHEN - MENU HABIS) ---
export const updateProductStatus = async (id, status) => {
    // status: "Available" atau "Out of Stock"
    try {
        await axios.patch(`${API_URL}/products/${id}/status?status=${status}`);
    } catch (error) {
        console.error("Gagal update status:", error);
        throw error;
    }
};