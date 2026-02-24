import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Import Komponen Baru
import TransactionFilter from '../../components/SuperAdmin/Transaction/TransactionFilter';
import TransactionStats from '../../components/SuperAdmin/Transaction/TransactionStats';
import TransactionTable from '../../components/SuperAdmin/Transaction/TransactionTable';
import TransactionDetailModal from '../../components/SuperAdmin/Transaction/TransactionDetailModal';

// CSS Utama Halaman (hanya layout dasar)
import '../../styles/SuperAdmin/Transaction.css'; 

const TransactionPage = () => {
    // --- STATE ---
    const [transactions, setTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [sortOrder, setSortOrder] = useState('newest');

    const [totalRevenue, setTotalRevenue] = useState(0);
    const [transactionCount, setTransactionCount] = useState(0);

    // --- FETCH DATA ---
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('http://127.0.0.1:8000/orders/?status=PAID');
                setTransactions(res.data);
                setFilteredTransactions(res.data);
            } catch (error) {
                console.error("Gagal ambil data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // --- LOGIC FILTER & SORT ---
    useEffect(() => {
        let result = [...transactions];

        if (startDate || endDate) {
            result = result.filter(trx => {
                const trxDate = new Date(trx.created_at).toISOString().split('T')[0];
                const isAfterStart = startDate ? trxDate >= startDate : true;
                const isBeforeEnd = endDate ? trxDate <= endDate : true;
                return isAfterStart && isBeforeEnd;
            });
        }

        result.sort((a, b) => {
            const dateA = new Date(a.created_at);
            const dateB = new Date(b.created_at);
            return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
        });

        setFilteredTransactions(result);
        setTransactionCount(result.length);
        setTotalRevenue(result.reduce((acc, curr) => acc + curr.total_price, 0));

    }, [transactions, startDate, endDate, sortOrder]);

    // --- HANDLERS ---
    const handleToday = () => {
        const today = new Date().toISOString().split('T')[0];
        setStartDate(today); setEndDate(today);
    };

    const handleThisWeek = () => {
        const curr = new Date();
        const first = curr.getDate() - curr.getDay() + 1; 
        const firstDay = new Date(curr.setDate(first)).toISOString().split('T')[0];
        const today = new Date().toISOString().split('T')[0];
        setStartDate(firstDay); setEndDate(today);
    };

    const handleThisMonth = () => {
        const date = new Date();
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
        const today = new Date().toISOString().split('T')[0];
        setStartDate(firstDay); setEndDate(today);
    };

    const handleReset = () => {
        setStartDate(''); setEndDate(''); setSortOrder('newest');
    };

    return (
        <div className="admin-page-container">
            <div className="page-header">
                <h1 className="page-title">Riwayat Transaksi</h1>
                <p className="page-subtitle">Laporan keuangan dan status pembayaran.</p>
            </div>

            <TransactionStats 
                count={transactionCount} 
                revenue={totalRevenue} 
                isFiltered={startDate || endDate}
            />

            <TransactionFilter 
                startDate={startDate} setStartDate={setStartDate}
                endDate={endDate} setEndDate={setEndDate}
                sortOrder={sortOrder} setSortOrder={setSortOrder}
                onToday={handleToday} onThisWeek={handleThisWeek}
                onThisMonth={handleThisMonth} onReset={handleReset}
            />

            <TransactionTable 
                transactions={filteredTransactions} 
                loading={loading}
                onViewDetail={setSelectedOrder} 
            />

            <TransactionDetailModal 
                order={selectedOrder} 
                onClose={() => setSelectedOrder(null)} 
            />
        </div>
    );
};

export default TransactionPage;