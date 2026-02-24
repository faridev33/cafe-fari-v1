import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getProductOptions } from '../../services/productApi';
import '../../styles/Cashier/CashierStyles.css';

// Import Komponen Baru
import PaymentTable from '../../components/Cashier/PaymentTable';
import PaymentModal from '../../components/Cashier/PaymentModal';

const CashierPayment = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // --- STATE MODAL ---
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [cashRaw, setCashRaw] = useState(0); 
    const [cashDisplay, setCashDisplay] = useState('');
    const [change, setChange] = useState(0);
    const [itemOptionsMap, setItemOptionsMap] = useState({});

    const fetchOrders = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:8000/orders/?status=UNPAID');
            setOrders(res.data);
        } catch (err) { console.error(err); } 
        finally { setLoading(false); }
    };

    useEffect(() => { fetchOrders(); }, []);

    // --- LOGIC MODAL ---
    const openPaymentModal = async (order) => {
        const orderCopy = JSON.parse(JSON.stringify(order));
        setSelectedOrder(orderCopy);
        setCashRaw(0); setCashDisplay(''); setChange(0 - order.total_price);

        const optionsMap = {};
        for (const item of orderCopy.items) {
            if (!optionsMap[item.id]) {
                try {
                    const opts = await getProductOptions(item.id);
                    optionsMap[item.id] = opts; 
                } catch (e) {}
            }
        }
        setItemOptionsMap(optionsMap);
    };

    const updateItemQty = (index, delta) => {
        const updatedOrder = { ...selectedOrder };
        const item = updatedOrder.items[index];
        item.quantity += delta;
        if (item.quantity <= 0) {
            if(window.confirm("Hapus item ini?")) updatedOrder.items.splice(index, 1);
            else item.quantity = 1;
        }
        recalculateTotal(updatedOrder);
    };

    const deleteItem = (index) => {
        if(window.confirm("Hapus item ini?")) {
            const updatedOrder = { ...selectedOrder };
            updatedOrder.items.splice(index, 1);
            recalculateTotal(updatedOrder);
        }
    };

    const updateItemNote = (index, newNote) => {
        const updatedOrder = { ...selectedOrder };
        updatedOrder.items[index].note = newNote;
        setSelectedOrder(updatedOrder);
    };

    const handleOptionChange = (itemIndex, optionName, choice) => {
        const updatedOrder = { ...selectedOrder };
        const item = updatedOrder.items[itemIndex];
        if (!item.selectedChoices) item.selectedChoices = {};
        item.selectedChoices[optionName] = choice;

        let newPrice = item.originalPrice || item.price;
        Object.values(item.selectedChoices).forEach(c => { newPrice += c.extra_price; });
        item.price = newPrice;
        item.optionsText = Object.values(item.selectedChoices).map(c => c.name).join(', ');

        recalculateTotal(updatedOrder);
    };

    const recalculateTotal = (order) => {
        order.total_price = order.items.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
        setSelectedOrder(order);
        calculateChange(cashRaw, order.total_price);
    };

    const handleCashInput = (e) => {
        const rawValue = e.target.value.replace(/\./g, '');
        const numberValue = parseInt(rawValue, 10) || 0;
        setCashRaw(numberValue);
        setCashDisplay(rawValue === '' ? '' : numberValue.toLocaleString('id-ID'));
        calculateChange(numberValue, selectedOrder.total_price);
    };

    const calculateChange = (cash, total) => setChange(cash - total);

    const handleProcessPayment = async () => {
        if (!selectedOrder) return;
        try {
            // Gabungkan Opsi ke Note sebelum simpan
            selectedOrder.items.forEach(item => {
                if (item.optionsText) {
                    const manualNote = item.note ? item.note.split('|').pop().trim() : ''; 
                    item.note = `${item.optionsText} | ${manualNote}`;
                }
            });

            await axios.put(`http://127.0.0.1:8000/orders/${selectedOrder.id}/items`, {
                items: selectedOrder.items,
                total_price: selectedOrder.total_price
            });
            await axios.put(`http://127.0.0.1:8000/orders/${selectedOrder.id}/pay`);

            alert(`✅ LUNAS!\nKembalian: Rp ${change.toLocaleString('id-ID')}`);
            setSelectedOrder(null);
            fetchOrders();
        } catch (error) { alert("Gagal memproses transaksi."); }
    };

    return (
        <div>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <h2 className="page-title">Kasir</h2>
                <button className="btn-action" onClick={fetchOrders}>Refresh</button>
            </div>

            {/* Panggil Komponen Tabel */}
            <PaymentTable 
                orders={orders} 
                loading={loading} 
                onPayClick={openPaymentModal} 
            />

            {/* Panggil Komponen Modal */}
            <PaymentModal 
                selectedOrder={selectedOrder}
                itemOptionsMap={itemOptionsMap}
                cashDisplay={cashDisplay}
                change={change}
                cashRaw={cashRaw}
                onClose={() => setSelectedOrder(null)}
                onUpdateQty={updateItemQty}
                onUpdateNote={updateItemNote}
                onOptionChange={handleOptionChange}
                onDeleteItem={deleteItem}
                onCashInput={handleCashInput}
                onProcessPayment={handleProcessPayment}
            />
        </div>
    );
};

export default CashierPayment;