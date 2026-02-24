import React from 'react';
import '../../../styles/SuperAdmin/Transaction/TransactionStats.css';

const TransactionStats = ({ count, revenue, isFiltered }) => {
    return (
        <div className="stats-grid">
            <div className="stat-card">
                <div className="stat-label">Total Transaksi</div>
                <div className="stat-value">{count}</div>
                <div className="stat-desc">
                    {isFiltered ? 'Dalam periode terpilih' : 'Sejak awal'}
                </div>
            </div>
            <div className="stat-card green">
                <div className="stat-label">Total Pendapatan</div>
                <div className="stat-value">Rp {revenue.toLocaleString('id-ID')}</div>
                <div className="stat-desc">
                    {isFiltered ? 'Omset periode terpilih' : 'Total Omset Keseluruhan'}
                </div>
            </div>
        </div>
    );
};

export default TransactionStats;