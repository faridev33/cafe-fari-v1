import React, { useState, useRef } from 'react';
import '../../../styles/SuperAdmin/User/UserStyles.css';

const UserForm = ({ onSubmit, initialData = {} }) => {
  const [formData, setFormData] = useState({
    username: initialData.username || '',
    password: '', // Password kosong default (hanya diisi jika ingin mengubah/buat baru)
    role: initialData.role || 'Waiter',
  });

  const [imagePreview, setImagePreview] = useState(initialData.image || null);
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validasi: Jika buat baru, password wajib. Jika edit, opsional.
    if (!initialData.id && !formData.password) {
      alert("Password wajib diisi untuk pengguna baru!");
      return;
    }
    const dataToSubmit = { ...formData, image: imageFile };
    onSubmit(dataToSubmit);
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        
        {/* Foto Profil */}
        <div className="form-group">
          <label>Foto Profil</label>
          <div className="upload-layout">
            <div className="drop-zone" onClick={() => fileInputRef.current.click()}>
              <span>📷</span>
              <small>Klik untuk upload</small>
              <input 
                type="file" ref={fileInputRef} onChange={handleFileSelect} 
                className="hidden-file-input" accept="image/*" style={{display:'none'}}
              />
            </div>
            <div className="preview-zone">
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="Preview" className="preview-img" />
                  <button type="button" className="btn-remove-img" onClick={() => {
                    setImagePreview(null); setImageFile(null);
                  }}>X</button>
                </>
              ) : <small>No Image</small>}
            </div>
          </div>
        </div>

        {/* Username */}
        <div className="form-group">
          <label>Username</label>
          <input 
            type="text" name="username" value={formData.username} 
            onChange={handleChange} required placeholder="Masukkan username"
          />
        </div>

        {/* Password */}
        <div className="form-group">
          <label>
            Password 
            {initialData.id && <small style={{fontWeight:'normal', color:'#888'}}> (Kosongkan jika tidak ingin mengubah)</small>}
          </label>
          <input 
            type="password" name="password" value={formData.password} 
            onChange={handleChange} placeholder="*******"
          />
        </div>

        {/* Role */}
        <div className="form-group">
          <label>Role / Jabatan</label>
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="SuperAdmin">Super Admin</option>
            <option value="Cashier">Cashier (Kasir)</option> 
            <option value="Waiter">Waiter (Pelayan)</option>
            <option value="Kitchen">Kitchen (Dapur)</option>
            <option value="Customer">Customer</option>
          </select>
        </div>

        <button type="submit" className="btn-save">Simpan Pengguna</button>
      </form>
    </div>
  );
};

export default UserForm;