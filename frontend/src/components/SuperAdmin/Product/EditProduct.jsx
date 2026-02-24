import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProductForm from './ProductForm';
import { getProductById, updateProduct } from '../../../services/productApi';
import '../../../styles/SuperAdmin/Product/ProductStyles.css';

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Ambil ID dari URL
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Ambil data produk saat halaman dibuka
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProductById(id);
        setInitialData(data);
      } catch (error) {
        alert("Gagal mengambil data produk.");
        navigate('/admin/products');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleUpdate = async (formData) => {
    try {
      await updateProduct(id, formData);
      alert('Menu berhasil diperbarui!');
      navigate('/admin/products');
    } catch (error) {
      alert("Gagal memperbarui menu.");
    }
  };

  if (loading) return <p style={{textAlign:'center', marginTop:'20px'}}>Loading data...</p>;

  return (
    <div className="product-container">
      <div className="header-action">
        <h2>Edit Menu</h2>
        <button 
          className="btn-secondary" 
          onClick={() => navigate('/admin/products')}
        >
          &larr; Batal
        </button>
      </div>
      
      {/* Kirim data lama ke Form via initialData */}
      <ProductForm 
        initialData={initialData} 
        onSubmit={handleUpdate} 
      />
    </div>
  );
};

export default EditProduct;