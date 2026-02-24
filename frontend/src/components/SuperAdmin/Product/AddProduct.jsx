import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductForm from './ProductForm';
import { createProduct } from '../../../services/productApi';
import '../../../styles/SuperAdmin/Product/ProductStyles.css';

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleCreate = async (formData) => {
    setLoading(true); // Mulai loading
    try {
      // 1. Kirim data ke Backend
      await createProduct(formData);
      
      // 2. Tampilkan pesan sukses
      alert('Menu berhasil ditambahkan!');
      
      // 3. KEMBALIKAN ke halaman Manajemen Produk
      // Pastikan path ini sesuai dengan route di App.jsx Anda ('/admin/products')
      navigate('/admin/products'); 

    } catch (error) {
      console.error("Gagal menambah produk:", error);
      alert("Terjadi kesalahan saat menyimpan menu.");
    } finally {
      setLoading(false); // Selesai loading
    }
  };

  return (
    <div className="product-container">
      <div className="header-action">
        <h2>Tambah Menu Baru</h2>
        <button 
          className="btn-secondary" 
          onClick={() => navigate('/admin/products')} // Tombol Kembali manual
        >
          &larr; Batal & Kembali
        </button>
      </div>
      
      {/* 
         Kita oper fungsi handleCreate ke props onSubmit.
         Jadi saat tombol "Simpan Menu" di Form diklik,
         dia akan menjalankan handleCreate di sini.
      */}
      {loading ? (
        <p style={{textAlign:'center'}}>Sedang menyimpan data...</p>
      ) : (
        <ProductForm onSubmit={handleCreate} />
      )}
    </div>
  );
};

export default AddProduct;