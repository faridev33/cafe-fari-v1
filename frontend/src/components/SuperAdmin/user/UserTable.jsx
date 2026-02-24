import React from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteUser } from '../../../services/userApi';
import '../../../styles/SuperAdmin/User/UserStyles.css';

const UserTable = ({ users, refreshData }) => {
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus pengguna ini?")) {
      try {
        await deleteUser(id);
        alert("Pengguna berhasil dihapus.");
        refreshData();
      } catch (error) {
        alert("Gagal menghapus pengguna.");
      }
    }
  };

  const getRoleClass = (role) => {
    switch(role) {
        case 'SuperAdmin': return 'role-superadmin';
        case 'Waiter': return 'role-waiter';
        case 'Kitchen': return 'role-kitchen';
        default: return 'role-customer';
    }
  };

  return (
    <div className="table-responsive">
      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Foto</th>
            <th>Username</th>
            <th>Role</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>
                  {user.image ? (
                    <img src={user.image} alt={user.username} className="table-avatar" />
                  ) : (
                    <div className="no-avatar">{user.username.charAt(0).toUpperCase()}</div>
                  )}
                </td>
                <td>{user.username}</td>
                <td>
                  <span className={`role-badge ${getRoleClass(user.role)}`}>
                    {user.role}
                  </span>
                </td>
                <td>
                  <button className="btn-edit" onClick={() => navigate(`/admin/users/edit/${user.id}`)}>Edit</button>
                  <button className="btn-delete" onClick={() => handleDelete(user.id)}>Hapus</button>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="5" style={{textAlign:'center'}}>Tidak ada data pengguna.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;