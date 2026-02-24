import React from 'react';
import '../../styles/Cashier/CashierStyles.css';

const HistoryTable = ({ orders, loading, onDetailClick }) => {
    const formatDate = (dateString) => {
        if(!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric', month: 'short', year: 'numeric', 
            hour: '2-digit', minute: '2-digit'
        });
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="cashier-card">
            <table className="cashier-table">
                <thead>
                    <tr>
                        <th>Waktu</th>
                        <th>Meja</th>
                        <th>Pelanggan</th>
                        <th>Total Lunas</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.length > 0 ? orders.map(order => (
                        <tr key={order.id}>
                            <td style={{fontSize:'13px', color:'#555'}}>{formatDate(order.created_at)}</td>
                            <td style={{fontSize:'1.1em', fontWeight:'bold'}}>{order.table_id}</td>
                            <td>{order.customer_name}</td>
                            <td className="price-tag">Rp {order.total_price.toLocaleString('id-ID')}</td>
                            <td>
                                <button 
                                    className="btn-action" 
                                    style={{background:'#17a2b8', border:'none'}} 
                                    onClick={() => onDetailClick(order)}
                                >
                                    📄 Detail
                                </button>
                            </td>
                        </tr>
                    )) : (
                        <tr><td colSpan="5" style={{textAlign:'center', padding:'40px', color:'#999', fontStyle:'italic'}}>
                            Tidak ada data yang cocok dengan pencarian.
                        </td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default HistoryTable;