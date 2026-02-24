import React from 'react';
import '../../styles/Customer/MenuGrid.css';

const MenuGrid = ({ products, loading, onProductClick }) => {
    if (loading) return <div style={{textAlign:'center', padding:'40px', color:'#888'}}>Memuat Menu...</div>;

    if (products.length === 0) return <div style={{textAlign:'center', padding:'40px', color:'#888'}}>Menu tidak ditemukan.</div>;

    return (
        <div className="menu-grid">
            {products.map((item) => {
                // Cek apakah item habis
                const isSoldOut = item.status === 'Out of Stock';

                return (
                    <div 
                        key={item.id} 
                        // Jika habis, tambahkan class css 'out-of-stock'
                        className={`menu-card ${isSoldOut ? 'out-of-stock' : ''}`} 
                        
                        // Jika habis, matikan fungsi klik
                        onClick={() => !isSoldOut && onProductClick(item)}
                    >
                        <div className="menu-img-box">
                            {item.image ? (
                                <img src={item.image} alt={item.name} className="menu-img" />
                            ) : (
                                <div style={{display:'flex', height:'100%', alignItems:'center', justifyContent:'center', color:'#aaa', fontSize:'10px'}}>No Image</div>
                            )}
                        </div>
                        
                        <div className="menu-details">
                            <div>
                                <h3 className="menu-name">{item.name}</h3>
                                <div className="menu-price">Rp {Number(item.price).toLocaleString('id-ID')}</div>
                            </div>
                            
                            {/* Ubah Teks Tombol */}
                            <button className="btn-add-cart">
                                {isSoldOut ? 'HABIS' : 'TAMBAH'}
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default MenuGrid;