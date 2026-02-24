import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import './SuperAdminLayout.css'; // Pastikan nama file CSS benar (SuperAdminLayout.css atau AdminLayout.css)

const AdminLayout = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    // --- CEK LOGIN SAAT HALAMAN DIMUAT ---
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        
        if (!storedUser) {
            // Belum login -> Tendang ke halaman Login
            navigate('/');
            return;
        }

        const parsedUser = JSON.parse(storedUser);
        
        // Cek Role (Harus SuperAdmin)
        if (parsedUser.role !== 'SuperAdmin') {
            alert("Akses Ditolak: Halaman ini khusus Super Admin.");
            localStorage.removeItem('user'); // Bersihkan data salah
            navigate('/');
            return;
        }

        setUser(parsedUser);
    }, [navigate]);

    const handleLogout = () => {
        // Hapus session
        localStorage.removeItem('user');
        alert("Anda berhasil keluar.");
        navigate('/');
    };

    // Jika user belum tervalidasi, jangan render konten dulu (hindari flicker)
    if (!user) return null; 

    return (
        <div className="admin-container">
            {/* --- SIDEBAR --- */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <h1 className="sidebar-title">Cafe Fari Admin</h1>
                    {/* Tampilkan Nama Admin */}
                    <small style={{ color: '#ccc', display: 'block', marginTop: '5px' }}>
                        Hi, {user.username}
                    </small>
                </div>

                <ul className="sidebar-menu">
                    <li className="menu-item">
                        <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? "menu-link active" : "menu-link"}>
                            Dashboard
                        </NavLink>
                    </li>
                    <li className="menu-item">
                        <NavLink to="/admin/products" className={({ isActive }) => isActive ? "menu-link active" : "menu-link"}>
                            Produk (Menu)
                        </NavLink>
                    </li>
                    <li className="menu-item">
                        <NavLink to="/admin/tables" className={({ isActive }) => isActive ? "menu-link active" : "menu-link"}>
                            Manajemen Meja
                        </NavLink>
                    </li>
                    <li className="menu-item">
                        <NavLink to="/admin/order-items" className={({ isActive }) => isActive ? "menu-link active" : "menu-link"}>
                            Detail Pesanan
                        </NavLink>
                    </li>
                    <li className="menu-item">
                        <NavLink to="/admin/transactions" className={({ isActive }) => isActive ? "menu-link active" : "menu-link"}>
                            Riwayat Transaksi
                        </NavLink>
                    </li>
                    <li className="menu-item">
                        <NavLink to="/admin/users" className={({ isActive }) => isActive ? "menu-link active" : "menu-link"}>
                            Pengguna (Staff)
                        </NavLink>
                    </li>
                </ul>

                <div className="sidebar-footer">
                    <button onClick={handleLogout} className="btn-logout">
                        Keluar
                    </button>
                </div>
            </aside>

            {/* --- KONTEN HALAMAN BERUBAH-UBAH DISINI --- */}
            <main className="main-content">
                <Outlet /> 
            </main>
        </div>
    );
};

export default AdminLayout;