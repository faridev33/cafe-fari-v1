import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import '../../styles/Cashier/CashierStyles.css'; // <--- (1) Ganti ke CSS Kasir yang benar

const CashierLayout = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) { navigate('/'); return; }
    
    const parsedUser = JSON.parse(storedUser);
    
    // Cek Role harus Cashier
    if (parsedUser.role !== 'Cashier') {
       alert("Akses ditolak: Halaman ini khusus Kasir"); 
       navigate('/'); 
       return;
    }
    setUser(parsedUser);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="cashier-layout"> {/* Gunakan class dari CashierStyles.css */}
      <aside className="cashier-sidebar">
        <div className="cashier-brand">
          CAFE FARI<br/>
          <small style={{fontSize:'12px', fontFamily:'var(--font-b)', color:'#888'}}>Cashier Panel</small>
        </div>
        
        <div style={{marginBottom:'20px', padding:'0 15px', color:'#ccc'}}>
            <small>Hi, {user.username}</small>
        </div>

        <nav className="cashier-nav">
           {/* Menu Dashboard */}
           <NavLink to="/cashier/dashboard" className={({ isActive }) => isActive ? "active" : ""}>
               Dashboard
           </NavLink>
           
           {/* Menu Pembayaran */}
           <NavLink to="/cashier/payment" className={({ isActive }) => isActive ? "active" : ""}>
               Pembayaran (Kasir)
           </NavLink>

           {/* (2) MENU BARU: RIWAYAT */}
           <NavLink to="/cashier/history" className={({ isActive }) => isActive ? "active" : ""}>
               Riwayat Transaksi
           </NavLink>
        </nav>

        <button onClick={handleLogout} className="btn-logout-cashier">Keluar</button>
      </aside>

      <main className="cashier-main">
        <Outlet />
      </main>
    </div>
  );
};

export default CashierLayout;