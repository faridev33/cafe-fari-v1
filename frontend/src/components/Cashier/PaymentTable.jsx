import React from 'react';
import '../../styles/Cashier/CashierStyles.css';

const PaymentTable = ({ orders, loading, onPayClick }) => {
    if (loading) return <p>Loading...</p>;

    return (
        <div className="cashier-card">
            <table className="cashier-table">
                <thead>
                    <tr>
                        <th>Meja</th>
                        <th>Nama</th>
                        <th>Total</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.length > 0 ? orders.map(order => (
                        <tr key={order.id}>
                            <td style={{fontSize:'1.2em', fontWeight:'bold'}}>{order.table_id}</td>
                            <td>{order.customer_name}</td>
                            <td className="price-tag">Rp {order.total_price.toLocaleString('id-ID')}</td>
                            <td>
                                <button className="btn-action" onClick={() => onPayClick(order)}>
                                    Bayar
                                </button>
                            </td>
                        </tr>
                    )) : (
                        <tr><td colSpan="4" style={{textAlign:'center', padding:'30px', color:'#999'}}>Tidak ada antrian pembayaran.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default PaymentTable;