import React from 'react';
import '../../styles/Customer/MenuHeader.css'; // Pakai style header yg lama aja

const OrderHeader = ({ tableId, onBack }) => {
    return (
        <header className="customer-header">
            <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                <button onClick={onBack} style={{background:'none', border:'none', fontSize:'24px', cursor:'pointer', color:'#5A4A42'}}>&larr;</button>
                <h1 className="cafe-title" style={{fontSize:'18px'}}>Rincian Pesanan</h1>
            </div>
            <div className="table-info">Meja {tableId}</div>
        </header>
    );
};

export default OrderHeader;