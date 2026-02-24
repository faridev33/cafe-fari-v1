import React from 'react';

const OrderFooter = ({ onCheckout, btnText }) => {
    return (
        <div style={{position:'fixed', bottom:0, left:0, right:0, padding:'20px', background:'white', borderTop:'1px solid #eee', maxWidth:'480px', margin:'0 auto', zIndex:99}}>
            <button className="btn-add-modal" onClick={onCheckout}>
                {btnText}
            </button>
        </div>
    );
};

export default OrderFooter;