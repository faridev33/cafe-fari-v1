import React from 'react';
import '../../styles/Customer/OrderPayment.css';

const OrderPaymentMethod = ({ selectedMethod, onSelect }) => {
    return (
        <div className="payment-section">
            <h4 style={{margin:'0 0 10px 0', fontSize:'14px', color:'#5A4A42'}}>Metode Pembayaran</h4>
            
            {['cash', 'qris', 'transfer'].map(method => (
                <div 
                    key={method}
                    className={`payment-option ${selectedMethod === method ? 'active' : ''}`} 
                    onClick={() => onSelect(method)}
                >
                    <span>
                        {method === 'cash' && '💵 Tunai (Bayar di Kasir)'}
                        {method === 'qris' && '📱 QRIS (Scan & Bayar)'}
                        {method === 'transfer' && '🏦 Transfer Bank'}
                    </span>
                    {selectedMethod === method && <span>&#10003;</span>}
                </div>
            ))}
        </div>
    );
};

export default OrderPaymentMethod;