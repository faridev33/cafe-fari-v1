import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import untuk pindah halaman
import ProductTable from '../../components/SuperAdmin/Product/ProductTable';
import { getProducts } from '../../services/productApi';
import '../../styles/SuperAdmin/Product/ProductStyles.css';

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Hook navigasi

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Gagal mengambil data produk", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-container">
      <div className="header-action">
        <h2>Manajemen Produk</h2>
        {/* Tombol mengarah ke halaman tambah */}
        <button className="btn-add" onClick={() => navigate('/admin/products/add')}>
          + Tambah Menu
        </button>
      </div>

      {loading ? (
        <p>Loading data...</p>
      ) : (
        /* 
           PENTING: 
           Kita kirim 'refreshData={fetchProducts}' 
           agar tabel bisa merefresh data setelah menghapus item.
        */
        <ProductTable products={products} refreshData={fetchProducts} />
      )}
      
    </div>
  );
};

export default ProductPage;