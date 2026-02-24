import React from 'react';
import '../../styles/Customer/OrderPayment.css';

const OrderNameInput = ({ value, onChange }) => {
    return (
        <div className="name-input-section">
            <label>Pesanan Atas Nama:</label>
            <input 
                id="input-nama" 
                type="text" 
                placeholder="Nama Anda..." 
                value={value} 
                onChange={onChange} 
                autoComplete="off"
            />
        </div>
    );
};

export default OrderNameInput;