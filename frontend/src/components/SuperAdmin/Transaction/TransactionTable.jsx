import React from 'react';
import '../../../styles/SuperAdmin/Transaction/TransactionTable.css';

const TransactionTable = ({ transactions, loading, onViewDetail }) => {
    
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('id-ID', {
            day: 'numeric', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    if (loading) return <p>Loading data...</p>;

    return (
        <div style={{overflowX:'auto'}}>
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>Tanggal</th>
                        <th>Meja</th>
                        <th>Pelanggan</th>
                        <th>Metode</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.length > 0 ? transactions.map(trx => (
                        <tr key={trx.id}>
                            <td>{formatDate(trx.created_at)}</td>
                            <td>{trx.table_id}</td>
                            <td>{trx.customer_name}</td>
                            <td><span className="badge-method">{trx.payment_method.toUpperCase()}</span></td>
                            <td style={{fontWeight:'bold', color:'#28a745'}}>Rp {trx.total_price.toLocaleString('id-ID')}</td>
                            <td><span className="badge-status badge-paid">LUNAS</span></td>
                            <td>
                                <button 
                                    onClick={() => onViewDetail(trx)}
                                    className="btn-detail"
                                >
                                    Detail
                                </button>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="7" style={{textAlign:'center', padding:'40px', color:'#999'}}>
                                Tidak ada transaksi pada periode ini.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default TransactionTable;