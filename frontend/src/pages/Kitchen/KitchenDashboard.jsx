import React, { useState, useEffect } from 'react';
import axios from 'axios';
import OrderTicket from '../../components/Kitchen/OrderTicket'; // Gunakan Komponen
import '../../styles/Kitchen/KitchenDashboard.css'; // CSS Terpisah

const KitchenDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:8000/orders/'); 
            // FILTER: Hanya yang belum selesai (QUEUED)
            const activeOrders = res.data.filter(o => o.cooking_status !== 'DONE');
            setOrders(activeOrders);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
        const interval = setInterval(fetchOrders, 10000);
        return () => clearInterval(interval);
    }, []);

    const handleDone = async (orderId) => {
        if(window.confirm("Pesanan selesai dimasak?")) {
            try {
                await axios.put(`http://127.0.0.1:8000/orders/${orderId}/cooking?status=DONE`);
                // Optimistic Update: Hapus langsung dari state agar cepat
                setOrders(orders.filter(o => o.id !== orderId));
            } catch (error) {
                alert("Gagal update status.");
            }
        }
    };

    return (
        <div>
            <div className="kitchen-header">
                <h2 className="kitchen-title">Antrian Masak</h2>
                <button onClick={fetchOrders} className="btn-refresh">Refresh</button>
            </div>

            {loading ? <p>Loading...</p> : (
                <div className="kitchen-grid">
                    {orders.length === 0 && <p style={{color:'#777'}}>Tidak ada pesanan aktif.</p>}
                    
                    {/* Render menggunakan Komponen OrderTicket */}
                    {orders.map(order => (
                        <OrderTicket 
                            key={order.id} 
                            order={order} 
                            onDone={handleDone} 
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default KitchenDashboard;