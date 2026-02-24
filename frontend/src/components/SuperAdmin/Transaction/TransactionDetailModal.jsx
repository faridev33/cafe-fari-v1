import React from 'react';
import '../../../styles/SuperAdmin/Transaction/TransactionModal.css';

const TransactionDetailModal = ({ order, onClose }) => {
    if (!order) return null;

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('id-ID', {
            day: 'numeric', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div className="modal-overlay">
            <div className="modal-box">
                <h3 className="modal-header-text">Detail Transaksi #{order.id}</h3>
                <p className="modal-date">{formatDate(order.created_at)}</p>
                <hr style={{border:'0', borderTop:'1px solid #eee', margin:'15px 0'}}/>
                
                <div className="item-list">
                    <ul style={{paddingLeft:'20px', marginTop:'5px'}}>
                        {order.items.map((item, idx) => (
                            <li key={idx} className="item-row">
                                <div className="item-flex">
                                    <span>{item.name} x{item.quantity}</span>
                                    <span>Rp {(item.price * item.quantity).toLocaleString()}</span>
                                </div>
                                {(item.note || item.optionsText) && (
                                    <div className="item-note">
                                        {item.optionsText} {item.note ? `| ${item.note}` : ''}
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="modal-total">
                    Total: Rp {order.total_price.toLocaleString('id-ID')}
                </div>

                <button onClick={onClose} className="btn-close-modal">
                    Tutup
                </button>
            </div>
        </div>
    );
};

export default TransactionDetailModal;