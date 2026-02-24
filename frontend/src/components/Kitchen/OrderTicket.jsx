import React from 'react';

const OrderTicket = ({ order, onDone, isHistory = false }) => {
    
    const formatTime = (isoString) => {
        return new Date(isoString).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    };

    return (
        <div className={`order-ticket ${isHistory ? 'done history-item' : ''}`}>
            <div className="ticket-header">
                <div className="table-number">Meja {order.table_id}</div>
                <div style={{textAlign:'right'}}>
                    <div style={{fontSize:'0.8rem', color:'#888'}}>{formatTime(order.created_at)}</div>
                    {/* Status Bayar */}
                    <span className={`order-status ${order.payment_status === 'PAID' ? 'status-paid' : 'status-unpaid'}`}>
                        {order.payment_status}
                    </span>
                </div>
            </div>

            <div className="ticket-items">
                <ul>
                    {order.items.map((item, idx) => (
                        <li key={idx} className="ticket-item">
                            <span className="qty-badge">{item.quantity}</span>
                            {item.name}
                            {(item.note || item.optionsText) && (
                                <span className="item-note">
                                    {item.optionsText} {item.note}
                                </span>
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Tombol hanya muncul jika BUKAN history */}
            {!isHistory && onDone && (
                <button className="btn-done" onClick={() => onDone(order.id)}>
                    ✅ Selesai Masak
                </button>
            )}
            
            {isHistory && (
                <div style={{textAlign:'center', marginTop:'10px', color:'#27ae60', fontWeight:'bold', fontSize:'0.9rem'}}>
                    ✔ SELESAI
                </div>
            )}
        </div>
    );
};

export default OrderTicket;