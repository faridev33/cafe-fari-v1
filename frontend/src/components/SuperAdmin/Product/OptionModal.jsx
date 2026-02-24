import React, { useState, useEffect } from 'react';
import { getProductOptions, saveProductOptions } from '../../../services/productApi';
import '../../../styles/SuperAdmin/Product/ProductStyles.css';

const OptionModal = ({ product, onClose }) => {
    const [options, setOptions] = useState([]);
    
    // State untuk input baru
    const [newOptionName, setNewOptionName] = useState('');

    useEffect(() => {
        if(product) fetchOptions();
    }, [product]);

    const fetchOptions = async () => {
        try {
            const data = await getProductOptions(product.id);
            setOptions(data);
        } catch (error) {
            console.error("Gagal ambil opsi");
        }
    };

    // --- HANDLERS ---
    const addOptionGroup = () => {
        if (!newOptionName) return;
        setOptions([...options, { name: newOptionName, choices: [] }]);
        setNewOptionName('');
    };

    const removeOptionGroup = (index) => {
        const newOpts = [...options];
        newOpts.splice(index, 1);
        setOptions(newOpts);
    };

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

    const handleSave = async () => {
        try {
            await saveProductOptions(product.id, options);
            alert("Opsi berhasil disimpan!");
            onClose();
        } catch (error) {
            alert("Gagal menyimpan opsi");
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{width: '600px', maxHeight:'90vh', overflowY:'auto'}}>
                <h3>Atur Varian & Opsi: {product.name}</h3>
                
                {/* LIST OPSI YANG SUDAH ADA */}
                <div style={{margin: '20px 0'}}>
                    {options.map((opt, grpIdx) => (
                        <div key={grpIdx} style={{border:'1px solid #ddd', padding:'15px', borderRadius:'8px', marginBottom:'15px', background:'#f9f9f9'}}>
                            <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px'}}>
                                <strong>Label: {opt.name}</strong>
                                <button onClick={() => removeOptionGroup(grpIdx)} style={{color:'red', border:'none', cursor:'pointer'}}>Hapus Grup</button>
                            </div>
                            
                            {/* LIST PILIHAN */}
                            <ul style={{listStyle:'none', padding:0}}>
                                {opt.choices.map((choice, chIdx) => (
                                    <li key={chIdx} style={{display:'flex', justifyContent:'space-between', padding:'5px 0', borderBottom:'1px dashed #eee'}}>
                                        <span>{choice.name}</span>
                                        <span>+Rp {choice.extra_price} <button onClick={() => removeChoice(grpIdx, chIdx)} style={{marginLeft:'10px', color:'red', border:'none', cursor:'pointer'}}>x</button></span>
                                    </li>
                                ))}
                            </ul>

                            {/* INPUT PILIHAN BARU */}
                            <div style={{display:'flex', gap:'5px', marginTop:'10px'}}>
                                <input id={`choice-name-${grpIdx}`} placeholder="Nama Pilihan (cth: Keju)" style={{flex:2, padding:'5px'}} />
                                <input id={`choice-price-${grpIdx}`} type="number" placeholder="Biaya Tambahan" style={{flex:1, padding:'5px'}} />
                                <button className="btn-add" style={{padding:'5px 10px'}} onClick={() => {
                                    const nameIn = document.getElementById(`choice-name-${grpIdx}`);
                                    const priceIn = document.getElementById(`choice-price-${grpIdx}`);
                                    addChoice(grpIdx, nameIn.value, priceIn.value);
                                    nameIn.value = ''; priceIn.value = '';
                                }}>+</button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* TAMBAH GRUP BARU */}
                <div style={{borderTop:'2px solid #eee', paddingTop:'15px', display:'flex', gap:'10px'}}>
                    <input 
                        value={newOptionName} 
                        onChange={(e) => setNewOptionName(e.target.value)}
                        placeholder="Buat Label Baru (cth: Level Pedas / Topping)" 
                        style={{flex:1, padding:'10px'}}
                    />
                    <button className="btn-secondary" onClick={addOptionGroup}>Buat Label</button>
                </div>

                <div style={{marginTop:'30px', display:'flex', gap:'10px', justifyContent:'flex-end'}}>
                    <button className="btn-secondary" onClick={onClose}>Tutup</button>
                    <button className="btn-add" onClick={handleSave}>Simpan Perubahan</button>
                </div>
            </div>
        </div>
    );
};

export default OptionModal;