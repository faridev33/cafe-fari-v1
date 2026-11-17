import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/global.css';

// --- IMPORT LAYOUTS ---
import SuperAdminLayout from './layouts/SuperAdmin/SuperAdminLayout';
import CustomerLayout from './layouts/Customer/CustomerLayout';
import CashierLayout from './layouts/Cashier/CashierLayout';
import KitchenLayout from './layouts/Kitchen/KitchenLayout'; 
import WaiterLayout from './layouts/Waiter/WaiterLayout';
import WaiterDashboard from './pages/Waiter/WaiterDashboard';

// --- IMPORT PAGES ---
import LoginPage from './pages/LoginPage';

// Pages: Customer
import CustomerMenu from './pages/Customer/CustomerMenu';
import CustomerOrder from './pages/Customer/CustomerOrder';
import CustomerStatus from './pages/Customer/CustomerStatus';

// Pages: Cashier
import CashierDashboard from './pages/Cashier/CashierDashboard';
import CashierPayment from './pages/Cashier/CashierPayment';
import CashierHistory from './pages/Cashier/CashierHistory';

// Pages: Kitchen
import KitchenDashboard from './pages/Kitchen/KitchenDashboard';
import KitchenHistory from './pages/Kitchen/KitchenHistory';
import KitchenMenu from './pages/Kitchen/KitchenMenu'; // <--- (NEW) Halaman Stok Menu

// Pages: Super Admin
import DashboardPage from './pages/SuperAdmin/DashboardPage';
import ProductPage from './pages/SuperAdmin/ProductPage';
import TablePage from './pages/SuperAdmin/TablePage';
import TransactionPage from './pages/SuperAdmin/TransactionPage';
import OrderItemPage from './pages/SuperAdmin/OrderItemPage';
import UserPage from './pages/SuperAdmin/UserPage';

// Components: Product Actions (Super Admin)
import AddProduct from './components/SuperAdmin/Product/AddProduct';  
import EditProduct from './components/SuperAdmin/Product/EditProduct';
import OptionPage from './components/SuperAdmin/Product/OptionPage';

// Components: User Actions (Super Admin)
import AddUser from './components/SuperAdmin/User/AddUser';
import EditUser from './components/SuperAdmin/User/EditUser';

function App() {
  return (
    <Router>
      <Routes>
        
        {/* 1. Rute Public (Halaman Login) */}
        <Route path="/" element={<LoginPage />} />
        
        {/* 2. Rute Customer (Tampilan HP Scan QR) */}
        <Route path="/customer" element={<CustomerLayout />}>
            <Route path="menu/:tableId" element={<CustomerMenu />} />
            <Route path="order/:tableId" element={<CustomerOrder />} />
            <Route path="status/:tableId" element={<CustomerStatus />} />
        </Route>

        {/* 3. Rute Kasir (Panel Kasir) */}
        <Route path="/cashier" element={<CashierLayout />}>
            <Route path="dashboard" element={<CashierDashboard />} />
            <Route path="payment" element={<CashierPayment />} />
            <Route path="history" element={<CashierHistory />} /> 
        </Route>

        {/* 4. Rute Kitchen (Layar Dapur) */}
        <Route path="/kitchen" element={<KitchenLayout />}>
            <Route index element={<KitchenDashboard />} /> {/* Halaman Utama Dapur (Antrian) */}
            <Route path="dashboard" element={<KitchenDashboard />} />
            <Route path="history" element={<KitchenHistory />} /> 
            <Route path="menu" element={<KitchenMenu />} /> {/* <--- (NEW) Halaman Stok Menu */}
        </Route>

        {/* Rute Waiter */}
        <Route path="/waiter" element={<WaiterLayout />}>
            <Route index element={<WaiterDashboard />} />
        </Route>

        {/* 5. Rute Super Admin (Panel Utama) */}
        <Route path="/admin" element={<SuperAdminLayout />}>
            <Route path="dashboard" element={<DashboardPage />} />
            
            {/* Manajemen Produk */}
            <Route path="products" element={<ProductPage />} />
            <Route path="products/add" element={<AddProduct />} />
            <Route path="products/edit/:id" element={<EditProduct />} />
            <Route path="products/options/:id" element={<OptionPage />} />
            
            {/* Manajemen Pengguna */}
            <Route path="users" element={<UserPage />} />
            <Route path="users/add" element={<AddUser />} />
            <Route path="users/edit/:id" element={<EditUser />} />

            {/* Menu Lainnya */}
            <Route path="tables" element={<TablePage />} />
            <Route path="transactions" element={<TransactionPage />} />
            <Route path="order-items" element={<OrderItemPage />} />
        </Route>

        {/* 6. Rute 404 (Opsional - Jika alamat salah) */}
        <Route path="*" element={
            <div style={{textAlign:'center', marginTop:'50px'}}>
                <h1>404</h1><p>Halaman tidak ditemukan</p>
                <a href="/">Kembali ke Login</a>
            </div>
        } />

      </Routes>
    </Router>
  );
}

export default App;