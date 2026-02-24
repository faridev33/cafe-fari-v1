import React from 'react';

const OrderSummary = ({ total }) => {
    return (
        <div style={{marginTop:'30px', borderTop:'2px dashed #D9CFC7', paddingTop:'20px'}}>
            <div style={{display:'flex', justifyContent:'space-between', fontWeight:'800', fontSize:'18px', color:'#5A4A42'}}>
                <span>Total Bayar</span>
                <span>Rp {total.toLocaleString('id-ID')}</span>
            </div>
        </div>
    );
};

export default OrderSummary;