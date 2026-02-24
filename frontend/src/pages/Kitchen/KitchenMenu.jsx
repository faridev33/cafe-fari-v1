import React, { useState, useEffect } from 'react';
import { getProducts, updateProductStatus } from '../../services/productApi';
import '../../styles/Kitchen/KitchenMenu.css';
import '../../styles/Kitchen/KitchenStyles.css';

const KitchenMenu = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = async () => {
        try {
            const data = await getProducts();
            setProducts(data);
        } catch (error) {
            console.error("Gagal load menu");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const toggleStatus = async (product) => {
        const newStatus = product.status === 'Available' ? 'Out of Stock' : 'Available';
        const actionName = newStatus === 'Available' ? 'Tersedia' : 'HABIS';
        
        if(window.confirm(`Ubah status ${product.name} menjadi ${actionName}?`)) {
            try {
                // Optimistic Update (Ubah tampilan dulu biar cepat)
                const updatedProducts = products.map(p => 
                    p.id === product.id ? { ...p, status: newStatus } : p
                );
                setProducts(updatedProducts);

                // Kirim ke Backend
                await updateProductStatus(product.id, newStatus);
            } catch (error) {
                alert("Gagal update status.");
                fetchProducts(); // Revert jika gagal
            }
        }
    };

    return (
        <div>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
                <h2 style={{color:'#2d3436'}}>Manajemen Stok Menu</h2>
                <button onClick={fetchProducts} style={{padding:'8px 15px', cursor:'pointer'}}>Refresh</button>
            </div>

            {loading ? <p>Loading...</p> : (
                <div className="stock-grid">
                    {products.map((item) => (
                        <div key={item.id} className={`stock-card ${item.status === 'Out of Stock' ? 'unavailable' : ''}`}>
                            <div style={{display:'flex', justifyContent:'center'}}>
                                {item.image ? (
                                    <img src={item.image} alt={item.name} className="stock-img" />
                                ) : (
                                    <div className="stock-img" style={{background:'#ccc', display:'flex', alignItems:'center', justifyContent:'center'}}>No Img</div>
                                )}
                            </div>
                            
                            <div className="stock-name">{item.name}</div>
                            
                            <div className={`stock-status ${item.status === 'Available' ? 'status-ok' : 'status-no'}`}>
                                {item.status}
                            </div>

                            <button 
                                className={`btn-toggle ${item.status === 'Available' ? 'btn-off' : 'btn-on'}`}
                                onClick={() => toggleStatus(item)}
                            >
                                {item.status === 'Available' ? 'Matikan (Habis)' : 'Aktifkan (Tersedia)'}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default KitchenMenu;