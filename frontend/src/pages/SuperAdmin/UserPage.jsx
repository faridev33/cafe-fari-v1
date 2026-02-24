import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserTable from '../../components/SuperAdmin/User/UserTable';
import { getUsers } from '../../services/userApi';
import '../../styles/SuperAdmin/User/UserStyles.css';

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error loading users", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-container">
      <div className="header-action">
        <h2>Manajemen Pengguna (Staff & Admin)</h2>
        <button className="btn-add" onClick={() => navigate('/admin/users/add')}>
          + Tambah User
        </button>
      </div>

      {loading ? (
        <p>Loading data...</p>
      ) : (
        <UserTable users={users} refreshData={fetchUsers} />
      )}
    </div>
  );
};

export default UserPage;