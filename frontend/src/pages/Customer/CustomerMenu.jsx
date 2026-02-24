import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProducts, getProductOptions } from '../../services/productApi';

// Import Komponen Baru
import MenuHeader from '../../components/Customer/MenuHeader';
import MenuFilter from '../../components/Customer/MenuFilter';
import MenuGrid from '../../components/Customer/MenuGrid';
import MenuModal from '../../components/Customer/MenuModal';

// CSS Umum (Floating Cart masih disini)
import '../../styles/Customer/customer.css'; 

const CustomerMenu = () => {
    const { tableId } = useParams();
    const navigate = useNavigate();
    
    // --- STORAGE LOGIC ---
    const CART_KEY = `cart_table_${tableId}`;
    const TIME_KEY = `lastAccess_table_${tableId}`;
    const EXPIRE_TIME = 5 * 60 * 1000; 

    const checkExpiration = () => {
        const lastAccess = localStorage.getItem(TIME_KEY);
        const now = Date.now();
        if (lastAccess && (now - parseInt(lastAccess) > EXPIRE_TIME)) {
            localStorage.removeItem(CART_KEY);
            localStorage.removeItem(TIME_KEY);
            return true;
        }
        localStorage.setItem(TIME_KEY, now.toString());
        return false;
    };

    // --- STATE ---
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('Semua');
    const [searchQuery, setSearchQuery] = useState('');
    
    const [cart, setCart] = useState(() => {
        if (checkExpiration()) return [];
        const savedCart = localStorage.getItem(CART_KEY);
        try { return savedCart ? JSON.parse(savedCart) : []; } catch { return []; }
    });

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [productOptions, setProductOptions] = useState([]);
    const [selectedChoices, setSelectedChoices] = useState({});
    const [qty, setQty] = useState(1);
    const [note, setNote] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);

    useEffect(() => {
        fetchProducts();
        const interval = setInterval(() => { if(checkExpiration()) setCart([]); }, 60000); 
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
        localStorage.setItem(TIME_KEY, Date.now().toString());
    }, [cart]);

    const fetchProducts = async () => {
        try {
            const data = await getProducts();
            
            // --- PERBAIKAN UTAMA DI SINI ---
            // Kita TIDAK melakukan filter status === 'Available'
            // Agar produk 'Out of Stock' tetap terambil dan bisa ditampilkan (abu-abu)
            setProducts(data); 
            
        } catch (error) { 
            console.error("Gagal memuat menu"); 
        } finally { 
            setLoading(false); 
        }
    };

    // --- HANDLERS ---
    const openModal = async (product) => {
        // Jangan buka modal jika status Out of Stock (Double check logic)
        if (product.status === 'Out of Stock') return;

        setSelectedProduct(product);
        setQty(1); setNote(''); setSelectedTags([]); setSelectedChoices({}); setProductOptions([]);
        localStorage.setItem(TIME_KEY, Date.now().toString());
        try {
            const optionsData = await getProductOptions(product.id);
            setProductOptions(optionsData);
        } catch (e) {}
    };

    const handleAddToCart = () => {
        if (!selectedProduct) return;
        let basePrice = selectedProduct.price;
        Object.values(selectedChoices).forEach(c => basePrice += c.extra_price);

        const optionsText = Object.values(selectedChoices).map(c => c.name).join(', ');
        const finalNote = [optionsText, ...selectedTags, note].filter(Boolean).join(', ');

        const newItem = {
            cartId: Date.now(),
            id: selectedProduct.id,
            name: selectedProduct.name,
            price: basePrice,
            image: selectedProduct.image,
            quantity: qty,
            note: finalNote,
            selectedChoices
        };

        setCart([...cart, newItem]);
        setSelectedProduct(null);
    };

    const filteredProducts = products.filter(p => {
        const catMatch = activeCategory === 'Semua' || p.category === activeCategory;
        const nameMatch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        return catMatch && nameMatch;
    });

    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    const grandTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    return (
        <div className="customer-page">
            <MenuHeader tableId={tableId} />
            
            <MenuFilter 
                activeCategory={activeCategory} setActiveCategory={setActiveCategory}
                searchQuery={searchQuery} setSearchQuery={setSearchQuery}
            />

            <MenuGrid 
                products={filteredProducts} 
                loading={loading} 
                onProductClick={openModal} 
            />

            {/* Floating Cart (Masih disini karena simple) */}
            {cart.length > 0 && (
                <div className="floating-cart" onClick={() => navigate(`/customer/order/${tableId}`)}>
                    <div className="cart-info">
                        <span className="cart-count">{totalItems} Item</span>
                        <span className="cart-total">Rp {grandTotal.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="cart-arrow">Lihat Pesanan &rarr;</div>
                </div>
            )}

            <MenuModal 
                product={selectedProduct}
                productOptions={productOptions}
                selectedChoices={selectedChoices}
                qty={qty} note={note} selectedTags={selectedTags}
                onClose={() => setSelectedProduct(null)}
                onQtyChange={(d) => setQty(Math.max(1, qty + d))}
                onNoteChange={(e) => setNote(e.target.value)}
                onTagToggle={(tag) => selectedTags.includes(tag) ? setSelectedTags(selectedTags.filter(t=>t!==tag)) : setSelectedTags([...selectedTags, tag])}
                onChoiceSelect={(opt, choice) => setSelectedChoices({...selectedChoices, [opt]: choice})}
                onAddToCart={handleAddToCart}
            />
        </div>
    );
};

export default CustomerMenu;