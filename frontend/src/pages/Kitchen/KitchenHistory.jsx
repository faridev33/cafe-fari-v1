import React, { useState, useEffect } from 'react';
import axios from 'axios';
import OrderTicket from '../../components/Kitchen/OrderTicket'; // Gunakan Komponen
import '../../styles/Kitchen/KitchenHistory.css'; // CSS Terpisah
// Kita juga butuh style dashboard untuk layout grid umum
import '../../styles/Kitchen/KitchenDashboard.css'; 

const KitchenHistory = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchHistory = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:8000/orders/');
            // FILTER: Hanya yang SUDAH selesai (DONE)
            const doneOrders = res.data.filter(o => o.cooking_status === 'DONE');
            
            // Urutkan dari terbaru
            doneOrders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            
            setHistory(doneOrders);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    return (
        <div>
            <div className="kitchen-header">
                <h2 className="kitchen-title">Riwayat Masak (Selesai)</h2>
                <button onClick={fetchHistory} className="btn-refresh">Refresh</button>
            </div>

            {loading ? <p>Loading...</p> : (
                <div className="kitchen-grid history-grid">
                    {history.length === 0 && <p className="history-empty">Belum ada riwayat masak.</p>}
                    
                    {/* Render menggunakan Komponen OrderTicket dengan prop isHistory */}
                    {history.map(order => (
                        <OrderTicket 
                            key={order.id} 
                            order={order} 
                            isHistory={true} 
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default KitchenHistory;