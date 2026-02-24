import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import UserForm from './UserForm';
import { getUserById, updateUser } from '../../../services/userApi';
import '../../../styles/SuperAdmin/User/UserStyles.css';

const EditUser = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserById(id);
        setInitialData(data);
      } catch (error) {
        alert("Gagal mengambil data user.");
        navigate('/admin/users');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id, navigate]);

  const handleUpdate = async (formData) => {
    try {
      await updateUser(id, formData);
      alert('Pengguna berhasil diperbarui!');
      navigate('/admin/users');
    } catch (error) {
      alert("Gagal update user.");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="user-container">
      <div className="header-action">
        <h2>Edit Pengguna</h2>
        <button className="btn-secondary" onClick={() => navigate('/admin/users')}>&larr; Batal</button>
      </div>
      <UserForm initialData={initialData} onSubmit={handleUpdate} />
    </div>
  );
};

export default EditUser;