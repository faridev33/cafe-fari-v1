import React from 'react';

const HistoryStats = ({ revenue }) => {
    return (
        <div style={{
            background: 'linear-gradient(135deg, #28a745, #218838)', 
            color: 'white', 
            padding: '20px', 
            borderRadius: '12px', 
            marginBottom: '25px',
            boxShadow: '0 4px 15px rgba(40, 167, 69, 0.3)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            <div>
                <h4 style={{margin:0, opacity:0.9, fontWeight:'normal'}}>Omset Hari Ini</h4>
                <h1 style={{margin:'5px 0 0 0', fontSize:'32px'}}>Rp {revenue.toLocaleString('id-ID')}</h1>
            </div>
            <div style={{textAlign:'right', opacity:0.8, fontSize:'12px'}}>
                Update Terakhir:<br/>
                {new Date().toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit'})}
            </div>
        </div>
    );
};

export default HistoryStats;