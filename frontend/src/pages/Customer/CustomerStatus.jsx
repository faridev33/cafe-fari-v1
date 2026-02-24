import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/Customer/customer.css';

const CustomerStatus = () => {
    const { tableId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);

    // Polling setiap 5 detik untuk cek status terbaru
    useEffect(() => {
        fetchStatus();
        const interval = setInterval(fetchStatus, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchStatus = async () => {
        try {
            const res = await axios.get(`http://127.0.0.1:8000/orders/status/${tableId}`);
            if (res.data && res.data.status !== "No Order") {
                setOrder(res.data);
            }
        } catch (error) {
            console.error("Gagal cek status");
        }
    };

    if (!order) return <div className="customer-page"><p style={{textAlign:'center', marginTop:'50px'}}>Belum ada pesanan aktif.</p></div>;

    const isPaid = order.payment_status === 'PAID';

    return (
        <div className="customer-page">
            <header className="customer-header">
                <h1 className="cafe-title">Status Pesanan</h1>
                <div className="table-info">Meja {tableId}</div>
            </header>

            <div style={{padding:'30px 20px', textAlign:'center'}}>
                {/* STATUS CARD */}
                <div style={{
                    background: isPaid ? '#d4edda' : '#fff3cd', 
                    padding:'30px', borderRadius:'15px', marginBottom:'20px',
                    color: isPaid ? '#155724' : '#856404',
                    border: isPaid ? '1px solid #c3e6cb' : '1px solid #ffeeba'
                }}>
                    <h2 style={{fontSize:'24px', margin:'0 0 10px 0'}}>
                        {isPaid ? '✅ Sudah Dibayar' : '⏳ Menunggu Pembayaran'}
                    </h2>
                    <p style={{margin:0}}>
                        {isPaid 
                            ? 'Pesanan Anda sedang disiapkan oleh dapur.' 
                            : 'Silakan lakukan pembayaran di Kasir.'}
                    </p>
                </div>

                <div className="cart-list" style={{textAlign:'left'}}>
                    <h4 style={{borderBottom:'1px solid #eee', paddingBottom:'10px'}}>Rincian Pesanan:</h4>
                    {order.items.map((item, i) => (
                        <div key={i} style={{display:'flex', justifyContent:'space-between', marginBottom:'8px', fontSize:'14px'}}>
                            <span>{item.quantity}x {item.name}</span>
                            <span>Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                        </div>
                    ))}
                    <div style={{display:'flex', justifyContent:'space-between', marginTop:'15px', fontWeight:'bold', fontSize:'16px'}}>
                        <span>Total</span>
                        <span>Rp {order.total_price.toLocaleString('id-ID')}</span>
                    </div>
                </div>

                {isPaid && (
                    <button className="btn-add-modal" style={{marginTop:'30px'}} onClick={() => navigate(`/customer/menu/${tableId}`)}>
                        Pesan Lagi
                    </button>
                )}
            </div>
        </div>
    );
};

export default CustomerStatus;