import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Import Komponen Baru
import HistoryStats from '../../components/Cashier/HistoryStats';
import HistoryFilter from '../../components/Cashier/HistoryFilter';
import HistoryTable from '../../components/Cashier/HistoryTable';
import HistoryDetailModal from '../../components/Cashier/HistoryDetailModal';

import '../../styles/Cashier/CashierStyles.css';

const CashierHistory = () => {
    // --- STATE UTAMA ---
    const [orders, setOrders] = useState([]); 
    const [filteredOrders, setFilteredOrders] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null); 
    const [todayRevenue, setTodayRevenue] = useState(0);

    // --- STATE FILTER ---
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDate, setFilterDate] = useState(''); 
    const [sortOrder, setSortOrder] = useState('newest'); 

    // --- FETCH DATA ---
    const fetchHistory = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:8000/orders/?status=PAID');
            setOrders(res.data);
            setFilteredOrders(res.data); 
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    // --- HITUNG OMSET HARI INI ---
    useEffect(() => {
        if (orders.length > 0) {
            const todayStr = new Date().toISOString().split('T')[0];
            const totalToday = orders.reduce((acc, order) => {
                const orderDate = new Date(order.created_at).toISOString().split('T')[0];
                return (orderDate === todayStr) ? acc + order.total_price : acc;
            }, 0);
            setTodayRevenue(totalToday);
        }
    }, [orders]);

    // --- LOGIC FILTERING ---
    useEffect(() => {
        let result = [...orders];

        if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            result = result.filter(o => 
                o.table_id.toLowerCase().includes(lower) || 
                o.customer_name.toLowerCase().includes(lower)
            );
        }

        if (filterDate) {
            result = result.filter(o => {
                const d = new Date(o.created_at).toISOString().split('T')[0];
                return d === filterDate;
            });
        }

        result.sort((a, b) => {
            const dA = new Date(a.created_at);
            const dB = new Date(b.created_at);
            return sortOrder === 'newest' ? dB - dA : dA - dB;
        });

        setFilteredOrders(result);
    }, [orders, searchTerm, filterDate, sortOrder]);

    // --- HANDLERS ---
    const handleToday = () => setFilterDate(new Date().toISOString().split('T')[0]);
    const handleReset = () => { setSearchTerm(''); setFilterDate(''); setSortOrder('newest'); };

    return (
        <div>
            {/* Header */}
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
                <h2 className="page-title">Riwayat Transaksi</h2>
                <button className="btn-action" onClick={fetchHistory}>Refresh Data</button>
            </div>

            {/* Components */}
            <HistoryStats revenue={todayRevenue} />
            
            <HistoryFilter 
                searchTerm={searchTerm} setSearchTerm={setSearchTerm}
                filterDate={filterDate} setFilterDate={setFilterDate}
                sortOrder={sortOrder} setSortOrder={setSortOrder}
                onToday={handleToday} onReset={handleReset}
            />

            <HistoryTable 
                orders={filteredOrders} 
                loading={loading} 
                onDetailClick={setSelectedOrder} 
            />

            <HistoryDetailModal 
                order={selectedOrder} 
                onClose={() => setSelectedOrder(null)} 
            />
        </div>
    );
};

export default CashierHistory;