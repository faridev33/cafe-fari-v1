import React from 'react';
import '../../styles/Customer/MenuModal.css'; // Pakai style modal yg ada

const PaymentSimulationModal = ({ grandTotal, isProcessing, onPay, onClose }) => {
    return (
        <div className="modal-overlay" style={{alignItems:'center'}}>
            <div className="modal-content" style={{borderRadius:'15px', textAlign:'center', padding:'30px'}}>
                {isProcessing ? (
                    <div><div className="spinner"></div><p style={{marginTop:'15px'}}>Memproses Pembayaran...</p></div>
                ) : (
                    <>
                        <h3>Simulasi Pembayaran</h3>
                        <p style={{marginBottom:'20px', color:'#555'}}>
                            Total Tagihan: <strong>Rp {grandTotal.toLocaleString('id-ID')}</strong>
                        </p>
                        
                        <div style={{background:'#f9f9f9', padding:'15px', marginBottom:'20px', borderRadius:'8px', border:'1px dashed #ccc'}}>
                            [AREA SCAN QR / VA NUMBER]
                        </div>

                        <button className="btn-add-modal" style={{background:'#28a745'}} onClick={onPay}>
                            Bayar Sekarang (Simulasi)
                        </button>
                        <button className="btn-close-text" style={{marginTop:'15px', color:'#dc3545', border:'none', background:'none', cursor:'pointer'}} onClick={onClose}>
                            Batal
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default PaymentSimulationModal;