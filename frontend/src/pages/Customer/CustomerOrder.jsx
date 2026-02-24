import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios'; 

// Import Components
import OrderHeader from '../../components/Customer/OrderHeader';
import OrderNameInput from '../../components/Customer/OrderNameInput';
import OrderCartList from '../../components/Customer/OrderCartList';
import OrderPaymentMethod from '../../components/Customer/OrderPaymentMethod';
import OrderSummary from '../../components/Customer/OrderSummary';
import OrderFooter from '../../components/Customer/OrderFooter';
import PaymentSimulationModal from '../../components/Customer/PaymentSimulationModal';

// CSS Utama Layout
import '../../styles/Customer/customer.css';

const CustomerOrder = () => {
    const { tableId } = useParams();
    const navigate = useNavigate();
    
    // --- STORAGE KEYS ---
    const CART_KEY = `cart_table_${tableId}`;
    const NAME_KEY = `customerName_table_${tableId}`;
    const TIME_KEY = `lastAccess_table_${tableId}`;

    // --- STATE ---
    const [cart, setCart] = useState(() => {
        const saved = localStorage.getItem(CART_KEY);
        try { return saved ? JSON.parse(saved) : []; } catch { return []; }
    });
    const [customerName, setCustomerName] = useState(() => localStorage.getItem(NAME_KEY) || '');
    const [paymentMethod, setPaymentMethod] = useState('cash'); 
    const [showPaymentModal, setShowPaymentModal] = useState(false); 
    const [isProcessing, setIsProcessing] = useState(false); 

    // --- EFFECT: SYNC STORAGE ---
    useEffect(() => {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
        localStorage.setItem(TIME_KEY, Date.now().toString());
    }, [cart, CART_KEY, TIME_KEY]);

    useEffect(() => {
        localStorage.setItem(NAME_KEY, customerName);
        localStorage.setItem(TIME_KEY, Date.now().toString());
    }, [customerName, NAME_KEY, TIME_KEY]);

    // --- HANDLERS ---
    const removeFromCart = (cartId) => {
        setCart(cart.filter(item => item.cartId !== cartId));
    };

    const grandTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const processOrder = async (paymentStatus) => {
        try {
            await axios.post('http://127.0.0.1:8000/orders/', {
                table_id: tableId,
                customer_name: customerName,
                total_price: grandTotal,
                payment_method: paymentMethod,
                payment_status: paymentStatus, 
                items: cart
            });

            alert("✅ Pesanan Berhasil Dikirim!");
            
            // Clear Data
            localStorage.removeItem(CART_KEY);
            localStorage.removeItem(NAME_KEY);
            localStorage.removeItem(TIME_KEY);
            setCart([]);
            setCustomerName('');
            
            navigate(`/customer/status/${tableId}`);
        } catch (error) {
            console.error(error);
            alert("Gagal kirim order. Cek koneksi.");
        }
    };

    const handleSimulatePayment = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setShowPaymentModal(false);
            processOrder("PAID"); 
        }, 2000);
    };

    const handleCheckoutClick = () => {
        if (!customerName.trim()) {
            alert("Mohon isi 'Atas Nama' terlebih dahulu.");
            document.getElementById('input-nama').focus();
            return;
        }
        if (cart.length === 0) return alert("Keranjang kosong.");

        if (paymentMethod === 'cash') {
            processOrder("UNPAID"); 
        } else {
            setShowPaymentModal(true);
        }
    };

    return (
        <div className="customer-page" style={{paddingBottom:'140px'}}>
            
            <OrderHeader tableId={tableId} onBack={() => navigate(`/customer/menu/${tableId}`)} />

            <div style={{padding:'20px'}}>
                <OrderNameInput value={customerName} onChange={(e) => setCustomerName(e.target.value)} />

                {cart.length > 0 ? (
                    <>
                        <OrderCartList cart={cart} onRemove={removeFromCart} />
                        <OrderPaymentMethod selectedMethod={paymentMethod} onSelect={setPaymentMethod} />
                        <OrderSummary total={grandTotal} />
                    </>
                ) : (
                    <div className="empty-state">
                        <p>Keranjang kosong.</p>
                        <button className="btn-add-cart" onClick={() => navigate(`/customer/menu/${tableId}`)}>Lihat Menu</button>
                    </div>
                )}
            </div>

            {cart.length > 0 && (
                <OrderFooter 
                    onCheckout={handleCheckoutClick} 
                    btnText={paymentMethod === 'cash' ? 'Kirim Pesanan' : 'Lanjut Pembayaran'} 
                />
            )}

            {showPaymentModal && (
                <PaymentSimulationModal 
                    grandTotal={grandTotal}
                    isProcessing={isProcessing}
                    onPay={handleSimulatePayment}
                    onClose={() => setShowPaymentModal(false)}
                />
            )}
        </div>
    );
};

export default CustomerOrder;