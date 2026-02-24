import React, { useState, useRef } from 'react';
import '../../../styles/SuperAdmin/Product/ProductStyles.css';

const ProductForm = ({ onSubmit, initialData = {} }) => {
  // --- STATE ---
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    category: initialData.category || 'Makanan',
    price: initialData.price || '', // Disimpan sebagai angka murni di state akhir, tapi di UI string
    status: initialData.status || 'Available'
  });

  // State tampilan harga (String dengan Rp. dan Titik)
  const [displayPrice, setDisplayPrice] = useState(initialData.price ? formatRupiah(String(initialData.price)) : '');

  // State Gambar
  const [imagePreview, setImagePreview] = useState(initialData.image || null);
  const [imageFile, setImageFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // State Kategori
  const [categories, setCategories] = useState(['Makanan', 'Minuman', 'Snack']);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');

  // --- HELPER FUNCTION: FORMAT RUPIAH ---
  function formatRupiah(angka, prefix = 'Rp. ') {
    if (!angka) return '';
    // Hapus karakter selain angka
    const number_string = angka.replace(/[^,\d]/g, '').toString();
    const split = number_string.split(',');
    const sisa = split[0].length % 3;
    let rupiah = split[0].substr(0, sisa);
    const ribuan = split[0].substr(sisa).match(/\d{3}/gi);

    if (ribuan) {
      const separator = sisa ? '.' : '';
      rupiah += separator + ribuan.join('.');
    }

    rupiah = split[1] !== undefined ? rupiah + ',' + split[1] : rupiah;
    return prefix + rupiah;
  }

  // --- HANDLERS ---

  // 1. Handle Input Text Biasa
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 2. Handle Harga Realtime
  const handlePriceChange = (e) => {
    const value = e.target.value;
    // Format tampilan ke user
    const formatted = formatRupiah(value);
    setDisplayPrice(formatted);

    // Simpan angka murni ke state (hapus Rp dan titik)
    const rawValue = value.replace(/[^0-9]/g, '');
    setFormData({ ...formData, price: rawValue });
  };

  // 3. Handle Drag & Drop Gambar
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    processFile(file);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    processFile(file);
  };

  const processFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      alert("Mohon upload file gambar.");
    }
  };

  // 4. Handle Kategori
  const handleCategoryChange = (e) => {
    const value = e.target.value;
    if (value === 'ADD_NEW') {
      setIsAddingCategory(true);
      setFormData({ ...formData, category: '' });
    } else {
      setIsAddingCategory(false);
      setFormData({ ...formData, category: value });
    }
  };

  const saveNewCategory = () => {
    if (newCategory.trim() !== '') {
      setCategories([...categories, newCategory]);
      setFormData({ ...formData, category: newCategory });
      setIsAddingCategory(false);
      setNewCategory('');
    }
  };

  // 5. Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isAddingCategory && formData.category === '') {
      alert("Harap isi nama kategori baru!");
      return;
    }
    const dataToSubmit = { ...formData, image: imageFile };
    onSubmit(dataToSubmit);
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        
        {/* --- SECTION GAMBAR (DRAG & DROP) --- */}
        <div className="form-group">
          <label>Foto Menu</label>
          <div className="upload-layout">
            
            {/* Bagian Kiri: Drop Zone */}
            <div 
              className={`drop-zone ${isDragging ? 'dragging' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current.click()}
            >
              <span className="icon">📂</span>
              <p>Seret gambar ke sini</p>
              <small>atau klik untuk memilih</small>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileSelect} 
                className="hidden-input" 
                accept="image/*"
              />
            </div>

            {/* Bagian Kanan: Preview */}
            <div className="preview-zone">
              {imagePreview ? (
                <div className="preview-content">
                    <img src={imagePreview} alt="Preview" />
                    <button type="button" className="btn-remove-img" onClick={() => {
                        setImagePreview(null);
                        setImageFile(null);
                    }}>Hapus</button>
                </div>
              ) : (
                <div className="empty-preview">
                    <p>Belum ada gambar</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --- SECTION INPUT TEXT --- */}
        <div className="form-row">
          <div className="form-group">
            <label>Nama Menu</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              placeholder="Contoh: Nasi Goreng Spesial"
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Kategori</label>
            {!isAddingCategory ? (
              <select name="category" value={formData.category} onChange={handleCategoryChange} required>
                {categories.map((cat, index) => (
                  <option key={index} value={cat}>{cat}</option>
                ))}
                <option value="ADD_NEW" className="add-new-option">+ Tambah Kategori Baru...</option>
              </select>
            ) : (
              <div className="new-category-input">
                <input 
                  type="text" 
                  placeholder="Ketik kategori..." 
                  value={newCategory} 
                  onChange={(e) => setNewCategory(e.target.value)}
                  autoFocus
                />
                <button type="button" onClick={saveNewCategory} className="btn-ok">OK</button>
                <button type="button" onClick={() => setIsAddingCategory(false)} className="btn-cancel">X</button>
              </div>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Harga</label>
            {/* Input Harga dengan Format Rupiah */}
            <input 
              type="text" 
              name="price" 
              value={displayPrice} 
              onChange={handlePriceChange} 
              placeholder="Rp. 0"
              required 
            />
          </div>

          <div className="form-group">
            <label>Status</label>
            <select name="status" value={formData.status} onChange={handleChange} required>
              <option value="Available">Tersedia (Available)</option>
              <option value="Out of Stock">Habis (Out of Stock)</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-save">Simpan Menu</button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;