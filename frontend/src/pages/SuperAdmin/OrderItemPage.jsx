import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/SuperAdmin/Transaction.css';

const OrderItemPage = () => {
    const [orders, setOrders] = useState([]); // Data asli dari API
    const [filteredOrders, setFilteredOrders] = useState([]); // Data yang ditampilkan
    const [loading, setLoading] = useState(true);

    // --- STATE FILTER ---
    const [filterDate, setFilterDate] = useState(''); // YYYY-MM-DD
    const [sortOrder, setSortOrder] = useState('newest'); // 'newest' | 'oldest'

    // Fetch Pesanan (Status APAPUN untuk monitoring history, atau UNPAID saja sesuai kebutuhan)
    // Disini kita ambil UNPAID (pesanan aktif) agar sesuai fungsi monitoring
    const fetchActiveOrders = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:8000/orders/?status=UNPAID');
            setOrders(res.data);
            setFilteredOrders(res.data); // Init display
        } catch (error) {
            console.error("Gagal load order");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActiveOrders();
        const interval = setInterval(fetchActiveOrders, 10000); // Auto refresh
        return () => clearInterval(interval);
    }, []);

    // --- LOGIC FILTERING ---
    useEffect(() => {
        let result = [...orders];

        // 1. Filter Tanggal (Jika ada)
        if (filterDate) {
            result = result.filter(order => {
                const orderDate = new Date(order.created_at).toISOString().split('T')[0];
                return orderDate === filterDate;
            });
        }

        // 2. Sorting
        result.sort((a, b) => {
            const dateA = new Date(a.created_at);
            const dateB = new Date(b.created_at);
            return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
        });

        setFilteredOrders(result);
    }, [orders, filterDate, sortOrder]);

    // Helper: Set Hari Ini
    const setToday = () => {
        const today = new Date().toISOString().split('T')[0];
        setFilterDate(today);
    };

    return (
        <div className="admin-page-container">
            <div className="page-header">
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'10px'}}>
                    <div>
                        <h1 className="page-title">Monitoring Pesanan Aktif</h1>
                        <p className="page-subtitle">Pesanan masuk yang belum dibayar.</p>
                    </div>
                    
                    {/* --- FILTER CONTROL BAR --- */}
                    <div style={{display:'flex', gap:'10px', alignItems:'center', background:'#f8f9fa', padding:'10px', borderRadius:'8px'}}>
                        <button 
                            onClick={setToday}
                            style={{padding:'8px 12px', border:'1px solid #ccc', borderRadius:'4px', cursor:'pointer', background:'white'}}
                        >
                            Hari Ini
                        </button>
                        
                        <input 
                            type="date" 
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                            style={{padding:'7px', border:'1px solid #ccc', borderRadius:'4px'}}
                        />

                        <select 
                            value={sortOrder} 
                            onChange={(e) => setSortOrder(e.target.value)}
                            style={{padding:'8px', border:'1px solid #ccc', borderRadius:'4px'}}
                        >
                            <option value="newest">Terbaru</option>
                            <option value="oldest">Terlama</option>
                        </select>

                        <button 
                            onClick={() => { setFilterDate(''); setSortOrder('newest'); }}
                            style={{padding:'8px 12px', border:'none', background:'#6c757d', color:'white', borderRadius:'4px', cursor:'pointer'}}
                        >
                            Reset
                        </button>
                    </div>
                </div>
            </div>

            {loading ? <p>Loading...</p> : (
                <div className="order-monitor-grid">
                    {filteredOrders.length === 0 && (
                        <div style={{gridColumn:'1/-1', textAlign:'center', padding:'40px', color:'#999', border:'2px dashed #eee', borderRadius:'10px'}}>
                            Tidak ada pesanan yang cocok dengan filter.
                        </div>
                    )}
                    
                    {filteredOrders.map(order => (
                        <div key={order.id} className="monitor-card">
                            <div className="monitor-header">
                                <div>
                                    <span style={{fontSize:'18px', fontWeight:'bold'}}>Meja {order.table_id}</span>
                                    <div style={{fontSize:'12px', color:'#777'}}>{order.customer_name}</div>
                                </div>
                                <div style={{textAlign:'right'}}>
                                    <span className="badge-status badge-unpaid">UNPAID</span>
                                    <div style={{fontSize:'11px', marginTop:'2px', color:'#555'}}>
                                        {new Date(order.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </div>
                                    <div style={{fontSize:'10px', color:'#999'}}>
                                        {new Date(order.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>

                            <div style={{marginTop:'10px', maxHeight:'200px', overflowY:'auto'}}>
                                {order.items.map((item, i) => (
                                    <div key={i} className="item-row">
                                        <div style={{fontWeight:'600'}}>
                                            {item.quantity}x {item.name}
                                        </div>
                                        {/* Tampilkan Opsi + Catatan */}
                                        {(item.note || item.optionsText) && (
                                            <div style={{fontSize:'11px', color:'#d35400', width:'100%', paddingLeft:'20px', fontStyle:'italic'}}>
                                                {item.optionsText} {item.note ? `| ${item.note}` : ''}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div style={{borderTop:'1px solid #eee', marginTop:'10px', paddingTop:'10px', textAlign:'right', fontWeight:'bold', color:'#28a745'}}>
                                Total: Rp {order.total_price.toLocaleString('id-ID')}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderItemPage;