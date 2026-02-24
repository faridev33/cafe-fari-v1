import React from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteProduct } from '../../../services/productApi';
import '../../../styles/SuperAdmin/Product/ProductStyles.css';
// import OptionModal tidak diperlukan lagi

const ProductTable = ({ products, refreshData }) => {
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus menu ini?")) {
      try {
        await deleteProduct(id);
        alert("Menu berhasil dihapus.");
        refreshData();
      } catch (error) {
        alert("Gagal menghapus menu.");
      }
    }
  };

  return (
    <div className="table-responsive">
      <table className="product-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Gambar</th>
            <th>Nama Menu</th>
            <th>Kategori</th>
            <th>Harga Dasar</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>
                  <div className="table-img">
                    {item.image ? <img src={item.image} alt={item.name} /> : <div className="no-img">No Img</div>}
                  </div>
                </td>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>Rp {Number(item.price).toLocaleString('id-ID')}</td>
                <td>
                  <span className={`status-badge ${item.status === 'Available' ? 'available' : 'unavailable'}`}>
                    {item.status}
                  </span>
                </td>
                <td>
                  {/* --- TOMBOL ARAH KE HALAMAN OPSI --- */}
                  <button 
                    className="btn-secondary"
                    style={{backgroundColor: '#17a2b8', marginRight:'5px', color:'white'}}
                    onClick={() => navigate(`/admin/products/options/${item.id}`)}
                  >
                    Atur Opsi
                  </button>

                  <button className="btn-edit" onClick={() => navigate(`/admin/products/edit/${item.id}`)}>Edit</button>
                  <button className="btn-delete" onClick={() => handleDelete(item.id)}>Hapus</button>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="7" style={{textAlign: 'center'}}>Tidak ada data menu.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;