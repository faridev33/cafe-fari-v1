import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import KitchenSidebar from '../../components/Kitchen/KitchenSidebar'; // Gunakan Komponen
import '../../styles/Kitchen/KitchenLayout.css'; // CSS Terpisah

const KitchenLayout = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Cek Login dari LocalStorage
    const storedUser = localStorage.getItem('user');
    
    if (!storedUser) { 
        // Belum Login -> Tendang ke halaman Login
        navigate('/'); 
        return; 
    }
    
    const parsedUser = JSON.parse(storedUser);
    
    // Cek Role harus Kitchen
    if (parsedUser.role !== 'Kitchen') {
       alert("Akses Ditolak: Halaman ini khusus Dapur"); 
       navigate('/'); 
       return;
    }
    
    setUser(parsedUser);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  // Jangan render apa-apa sebelum user tervalidasi
  if (!user) return null;

  return (
    <div className="kitchen-layout">
      {/* Panggil Sidebar sebagai Komponen Terpisah */}
      <KitchenSidebar user={user} onLogout={handleLogout} />

      {/* Area Konten Utama (Berubah-ubah sesuai Route) */}
      <main className="kitchen-main">
        <Outlet />
      </main>
    </div>
  );
};

export default KitchenLayout;