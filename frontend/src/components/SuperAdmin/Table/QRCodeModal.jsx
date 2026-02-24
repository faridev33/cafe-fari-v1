import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import '../../../styles/SuperAdmin/Table/TableStyles.css';

const QRCodeModal = ({ table, onClose }) => {
    if (!table) return null;


    const qrValue = `http://localhost:5173/customer/menu/${table.id}`;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                <h3>Meja {table.number}</h3>
                <p>Scan untuk pesan menu</p>
                
                <div className="qr-display">
                    <QRCodeCanvas 
                        value={qrValue} 
                        size={200} 
                        level={"H"} // High Error Correction
                        includeMargin={true}
                    />
                </div>
                
                <p style={{fontSize:'12px', color:'#888'}}>{qrValue}</p>
                
                <div style={{marginTop: '20px'}}>
                    <button className="btn-secondary" onClick={onClose}>Tutup</button>
                    <button 
                        className="btn-add" 
                        style={{marginLeft:'10px'}}
                        onClick={() => window.print()} // Print sederhana
                    >
                        Print
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QRCodeModal;