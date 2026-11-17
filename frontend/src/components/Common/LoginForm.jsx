import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Gunakan axios langsung agar lebih jelas URL-nya, atau gunakan apiClient jika sudah dikonfigurasikan
import '../../styles/Common/LoginForm.css';

// Import Gambar Background
import bgImage from '@/assets/images/pexels-fotios-photos-1024359.jpg';

export const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Pastikan URL mengarah ke backend FastAPI (default port 8000)
      const response = await axios.post('http://127.0.0.1:8000/login', {
        username,
        password,
      });

      const data = response.data;

      // Samakan penamaan role backend (admin, cashier, kitchen) dengan layout frontend
      const roleMap = {
        admin: 'SuperAdmin',
        superadmin: 'SuperAdmin',
        cashier: 'Cashier',
        kitchen: 'Kitchen',
        waiter: 'Waiter',
        customer: 'Customer',
      };
      const role = roleMap[String(data.role).toLowerCase()] || data.role;

      // Simpan data user lengkap (bukan cuma role) agar layout bisa pakai
      const userData = {
        username: data.username,
        role
      };
      localStorage.setItem('user', JSON.stringify(userData));

      // --- LOGIKA PENGALIHAN HALAMAN ---
      if (role === 'SuperAdmin') {
        navigate('/admin/dashboard');
      } else if (role === 'Kitchen') {
        navigate('/kitchen');
      } else if (role === 'Cashier') {
        navigate('/cashier/dashboard');
      } else if (role === 'Waiter') {
        navigate('/waiter');
      } else {
        setError(`Role "${data.role}" tidak dikenali atau belum memiliki halaman.`);
      }

    } catch (err) {
      console.error(err);
      if (err.response && err.response.data) {
        setError(err.response.data.detail || "Login gagal");
      } else {
        setError('Gagal terhubung ke server backend');
      }
    }
  };

  const handleQuickAccess = (role, path) => {
    const dummyUser = {
      username: role.toLowerCase(),
      role: role
    };
    localStorage.setItem('user', JSON.stringify(dummyUser));
    navigate(path);
  };

  return (
    <div 
      className="login-container" 
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="login-overlay">
        <div className="login-card glass-effect">
          <div className="header-section">
            <h2 className="cafe-name">Cafe Fari</h2>
            <p className="welcome-text">Silakan masuk untuk memulai shift Anda</p>
          </div>
          
          {error && <div className="error-msg">{error}</div>}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                className="form-input"
                placeholder="cth: admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-primary">
              MASUK
            </button>
          </form>

          <div className="quick-access-section">
            <div className="quick-access-divider">
              <span>Akses Cepat (Demo / Dev)</span>
            </div>
            <div className="quick-access-grid">
              <button 
                type="button" 
                className="btn-quick admin" 
                onClick={() => handleQuickAccess('SuperAdmin', '/admin/dashboard')}
              >
                Super Admin
              </button>
              <button 
                type="button" 
                className="btn-quick cashier" 
                onClick={() => handleQuickAccess('Cashier', '/cashier/dashboard')}
              >
                Kasir
              </button>
              <button 
                type="button" 
                className="btn-quick kitchen" 
                onClick={() => handleQuickAccess('Kitchen', '/kitchen')}
              >
                Dapur
              </button>
              <button 
                type="button" 
                className="btn-quick customer" 
                onClick={() => handleQuickAccess('Customer', '/customer/menu/1')}
              >
                Customer (Meja 1)
              </button>
            </div>
          </div>
          
          <div className="footer-text">
            <p>© 2025 Cafe Management System</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LoginForm;