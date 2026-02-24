import React from 'react';
import '../../styles/Customer/OrderCart.css';

const OrderCartList = ({ cart, onRemove }) => {
    if (cart.length === 0) return <div style={{textAlign:'center', padding:'40px', color:'#999'}}>Keranjang Kosong.</div>;

    return (
        <div className="cart-list">
            {cart.map((item) => (
                <div key={item.cartId} className="cart-item-row">
                    <div className="cart-img-thumb">
                        {item.image ? <img src={item.image} alt={item.name} /> : <div className="no-img-thumb"></div>}
                    </div>
                    
                    <div style={{flex:1}}>
                        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
                            <h4 style={{margin:'0 0 5px 0', fontSize:'15px', color:'#2c3e50'}}>{item.name}</h4>
                            <span style={{fontWeight:'bold', fontSize:'14px', color:'#C9B59C'}}>
                                Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                            </span>
                        </div>
                        
                        <div style={{fontSize:'13px', color:'#777', marginBottom:'8px', fontWeight:'600'}}>
                            {item.quantity} x @ Rp {item.price.toLocaleString('id-ID')}
                        </div>

                        {/* Opsi Terpilih */}
                        {item.selectedChoices && Object.keys(item.selectedChoices).length > 0 && (
                            <div className="selected-options-box">
                                {Object.entries(item.selectedChoices).map(([key, val], idx) => (
                                    <div key={idx} className="option-row-mini">
                                        <span className="opt-key">{key}:</span> 
                                        <span className="opt-val">{val.name}</span>
                                        {val.extra_price > 0 && <span className="opt-price">(+{val.extra_price/1000}k)</span>}
                                    </div>
                                ))}
                            </div>
                        )}

                        {item.note && (
                            <div className="manual-note-text">📝 {item.note}</div>
                        )}

                        <div style={{marginTop:'8px', textAlign:'right'}}>
                            <button onClick={() => onRemove(item.cartId)} style={{color:'#dc3545', border:'none', background:'none', fontSize:'12px', padding:0, cursor:'pointer', fontWeight:'bold'}}>
                                Hapus Item
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default OrderCartList;