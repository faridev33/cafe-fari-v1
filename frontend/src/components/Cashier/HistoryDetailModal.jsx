import React from 'react';

const HistoryDetailModal = ({ order, onClose }) => {
    if (!order) return null;

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'short', year: 'numeric', 
            hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div style={{
            position:'fixed', top:0, left:0, right:0, bottom:0,
            background:'rgba(0,0,0,0.6)', display:'flex', justifyContent:'center', alignItems:'center', zIndex:1000
        }}>
            <div style={{background:'white', padding:'30px', borderRadius:'12px', width:'500px', maxWidth:'95%', maxHeight:'90vh', overflowY:'auto'}}>
                <div style={{display:'flex', justifyContent:'space-between', borderBottom:'1px solid #eee', paddingBottom:'15px', marginBottom:'15px'}}>
                    <div>
                        <h3 style={{margin:0, color:'#2c3e50'}}>Transaksi #{order.id}</h3>
                        <small style={{color:'#888'}}>{formatDate(order.created_at)}</small>
                    </div>
                    <button onClick={onClose} style={{background:'none', border:'none', fontSize:'24px', cursor:'pointer'}}>&times;</button>
                </div>

                <div style={{background:'#f9f9f9', padding:'15px', borderRadius:'8px', marginBottom:'20px'}}>
                    <div style={{display:'flex', justifyContent:'space-between', marginBottom:'5px'}}>
                        <span>Meja:</span> <strong>{order.table_id}</strong>
                    </div>
                    <div style={{display:'flex', justifyContent:'space-between', marginBottom:'5px'}}>
                        <span>Pelanggan:</span> <strong>{order.customer_name}</strong>
                    </div>
                    <div style={{display:'flex', justifyContent:'space-between'}}>
                        <span>Metode:</span> <span className="tag-method">{order.payment_method}</span>
                    </div>
                </div>

                <h4 style={{marginBottom:'10px', borderBottom:'2px solid #eee', paddingBottom:'5px'}}>Rincian Menu</h4>
                <div style={{marginBottom:'20px'}}>
                    {order.items.map((item, idx) => (
                        <div key={idx} style={{display:'flex', justifyContent:'space-between', marginBottom:'8px', fontSize:'14px', borderBottom:'1px dashed #eee', paddingBottom:'8px'}}>
                            <div style={{flex:1}}>
                                <strong>{item.name}</strong> <small>x{item.quantity}</small>
                                {(item.note || item.optionsText) && (
                                    <div style={{fontSize:'11px', color:'#666', fontStyle:'italic', marginTop:'2px'}}>
                                        {item.optionsText} {item.note ? `| ${item.note}` : ''}
                                    </div>
                                )}
                            </div>
                            <div style={{fontWeight:'bold'}}>
                                {(item.price * item.quantity).toLocaleString()}
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{textAlign:'right', fontSize:'18px', paddingTop:'15px', borderTop:'2px solid #2c3e50'}}>
                    Total: <strong style={{color:'#28a745'}}>Rp {order.total_price.toLocaleString('id-ID')}</strong>
                </div>

                <div style={{marginTop:'25px', textAlign:'right'}}>
                    <button className="btn-action" onClick={() => window.print()}>🖨️ Cetak</button>
                    <button className="btn-action" style={{background:'#6c757d', marginLeft:'10px'}} onClick={onClose}>Tutup</button>
                </div>
            </div>
        </div>
    );
};

export default HistoryDetailModal;