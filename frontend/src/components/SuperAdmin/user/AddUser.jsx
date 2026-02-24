import React from 'react';
import { useNavigate } from 'react-router-dom';
import UserForm from './UserForm';
import { createUser } from '../../../services/userApi';
import '../../../styles/SuperAdmin/User/UserStyles.css';

const AddUser = () => {
  const navigate = useNavigate();

  const handleCreate = async (formData) => {
    try {
      await createUser(formData);
      alert('Pengguna berhasil ditambahkan!');
      navigate('/admin/users');
    } catch (error) {
      console.error("Gagal menambah user:", error);
      alert("Gagal menyimpan data.");
    }
  };

  return (
    <div className="user-container">
      <div className="header-action">
        <h2>Tambah Pengguna Baru</h2>
        <button className="btn-secondary" onClick={() => navigate('/admin/users')}>&larr; Kembali</button>
      </div>
      <UserForm onSubmit={handleCreate} />
    </div>
  );
};

export default AddUser;