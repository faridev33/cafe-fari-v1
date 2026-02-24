import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, getProductOptions, saveProductOptions } from '../../../services/productApi';
import '../../../styles/SuperAdmin/Product/OptionStyles.css';

const OptionPage = () => {
    const { id } = useParams(); // Ambil ID produk dari URL
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // State untuk input Label Baru (Paling bawah)
    const [newOptionGroupName, setNewOptionGroupName] = useState('');

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            // 1. Ambil detail produk (untuk nama)
            const productData = await getProductById(id);
            setProduct(productData);

            // 2. Ambil opsi yang sudah ada
            const optionsData = await getProductOptions(id);
            setOptions(optionsData);
        } catch (error) {
            alert("Gagal memuat data.");
            navigate('/admin/products');
        } finally {
            setLoading(false);
        }
    };

    // --- LOGIC GROUP (LABEL) ---
    const addOptionGroup = () => {
        if (!newOptionGroupName.trim()) return;
        setOptions([...options, { name: newOptionGroupName, choices: [] }]);
        setNewOptionGroupName('');
    };

    const removeOptionGroup = (index) => {
        if(window.confirm("Hapus grup opsi ini beserta semua pilihannya?")) {
            const newOpts = [...options];
            newOpts.splice(index, 1);
            setOptions(newOpts);
        }
    };

    // --- LOGIC CHOICE (PILIHAN) ---
    const addChoice = (groupIndex, name, price) => {
        if (!name) return;
        const newOpts = [...options];
        newOpts[groupIndex].choices.push({ name, extra_price: parseFloat(price) || 0 });
        setOptions(newOpts);
    };

    const removeChoice = (groupIndex, choiceIndex) => {
        const newOpts = [...options];
        newOpts[groupIndex].choices.splice(choiceIndex, 1);
        setOptions(newOpts);
    };

    // --- SAVE TO BACKEND ---
    const handleSave = async () => {
        try {
            await saveProductOptions(id, options);
            alert("Konfigurasi Opsi Berhasil Disimpan!");
            navigate('/admin/products');
        } catch (error) {
            console.error(error);
            alert("Gagal menyimpan opsi.");
        }
    };

    if (loading) return <div className="option-container">Loading...</div>;

    return (
        <div className="option-container">
            <div className="option-paper">
                {/* Header */}
                <div className="option-header">
                    <h2>
                        Atur Opsi: <span className="product-name-highlight">{product?.name}</span>
                    </h2>
                    <button className="btn-secondary" onClick={() => navigate('/admin/products')}>
                        Kembali
                    </button>
                </div>

                {/* List Option Groups */}
                {options.length === 0 && (
                    <p style={{textAlign:'center', color:'#888', fontStyle:'italic'}}>
                        Belum ada opsi tambahan untuk produk ini. Tambahkan di bawah.
                    </p>
                )}

                {options.map((opt, grpIdx) => (
                    <div key={grpIdx} className="option-group-card">
                        <div className="group-header">
                            <span className="group-title">{opt.name}</span>
                            <button className="btn-danger-outline" onClick={() => removeOptionGroup(grpIdx)}>
                                Hapus Grup
                            </button>
                        </div>

                        {/* Tabel Pilihan */}
                        <table className="choice-table">
                            <thead>
                                <tr>
                                    <th width="50%">Nama Pilihan</th>
                                    <th width="30%">Biaya Tambahan</th>
                                    <th width="20%">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {opt.choices.map((choice, chIdx) => (
                                    <tr key={chIdx}>
                                        <td>{choice.name}</td>
                                        <td className="price-text">
                                            {choice.extra_price > 0 ? `+Rp ${choice.extra_price.toLocaleString('id-ID')}` : 'Gratis'}
                                        </td>
                                        <td>
                                            <button className="btn-mini-del" onClick={() => removeChoice(grpIdx, chIdx)}>
                                                Hapus
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Input Pilihan Baru */}
                        <div className="add-choice-row">
                            <input 
                                id={`name-${grpIdx}`} 
                                className="input-text" 
                                placeholder="Contoh: Mozzarella" 
                            />
                            <input 
                                id={`price-${grpIdx}`} 
                                type="number" 
                                className="input-price" 
                                placeholder="Harga (0 jika gratis)" 
                            />
                            <button 
                                className="btn-mini-add"
                                onClick={() => {
                                    const nameEl = document.getElementById(`name-${grpIdx}`);
                                    const priceEl = document.getElementById(`price-${grpIdx}`);
                                    addChoice(grpIdx, nameEl.value, priceEl.value);
                                    nameEl.value = ''; priceEl.value = '';
                                    nameEl.focus();
                                }}
                            >
                                +
                            </button>
                        </div>
                    </div>
                ))}

                {/* Section Tambah Grup Baru */}
                <div className="add-group-section">
                    <strong style={{whiteSpace:'nowrap'}}>Label Baru:</strong>
                    <input 
                        className="input-text"
                        value={newOptionGroupName}
                        onChange={(e) => setNewOptionGroupName(e.target.value)}
                        placeholder="Contoh: Level Pedas, Topping, Ukuran..."
                    />
                    <button className="btn-secondary" onClick={addOptionGroup}>
                        Buat Label
                    </button>
                </div>

                {/* Footer Actions */}
                <div className="footer-actions">
                    <button className="btn-primary-large" onClick={handleSave}>
                        Simpan Semua Perubahan
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OptionPage;