import React from 'react';
import { NavLink } from 'react-router-dom';

const KitchenSidebar = ({ user, onLogout }) => {
    return (
        <aside className="kitchen-sidebar">
            <div className="kitchen-brand">
                KITCHEN<br/>
                <small style={{fontSize:'12px', fontWeight:'normal'}}>Display System</small>
            </div>
            
            <div className="chef-info">
                Chef {user.username}
            </div>

            <nav className="kitchen-nav">
                {/* 1. Antrian Masak */}
                <NavLink to="/kitchen/dashboard" className={({ isActive }) => isActive ? "active" : ""}>
                    Antrian Pesanan
                </NavLink>
                
                {/* 2. Riwayat Selesai */}
                <NavLink to="/kitchen/history" className={({ isActive }) => isActive ? "active" : ""}>
                    Riwayat Masak
                </NavLink>

                {/* 3. MENU BARU: STOK MENU */}
                <NavLink to="/kitchen/menu" className={({ isActive }) => isActive ? "active" : ""}>
                    Stok Menu
                </NavLink>
            </nav>

            <button onClick={onLogout} className="btn-logout-kitchen">Keluar</button>
        </aside>
    );
};

export default KitchenSidebar;

