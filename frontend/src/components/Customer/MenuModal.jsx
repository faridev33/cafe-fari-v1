import React from 'react';
import '../../styles/Customer/MenuModal.css';

const MenuModal = (props) => {
    const { 
        product, productOptions, selectedChoices, qty, note, selectedTags,
        onClose, onQtyChange, onNoteChange, onTagToggle, onChoiceSelect, onAddToCart 
    } = props;

    if (!product) return null;

    const quickNotes = ["Pedas", "Tidak Pedas", "Manis", "Kurangi Gula", "Dingin (Es)", "Panas/Hangat"];

    const calculateTotal = () => {
        let price = product.price;
        Object.values(selectedChoices).forEach(c => price += c.extra_price);
        return price * qty;
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                {product.image && (
                    <img src={product.image} alt={product.name} style={{width:'100%', aspectRatio:'1/1', objectFit:'cover', borderRadius:'10px', marginBottom:'15px'}} />
                )}

                <div style={{display:'flex', justifyContent:'space-between', borderBottom:'1px solid #eee', paddingBottom:'10px', marginBottom:'15px'}}>
                    <div>
                        <h3 style={{margin:0, fontSize:'18px'}}>{product.name}</h3>
                        <div style={{color:'#C9B59C', fontWeight:'bold'}}>Rp {Number(product.price).toLocaleString('id-ID')}</div>
                    </div>
                    <button onClick={onClose} style={{background:'none', border:'none', fontSize:'24px', cursor:'pointer'}}>&times;</button>
                </div>

                {/* OPTIONS */}
                {productOptions.length > 0 && (
                    <div style={{marginBottom:'20px'}}>
                        {productOptions.map((opt, idx) => (
                            <div key={idx} style={{marginBottom:'15px'}}>
                                <label style={{display:'block', fontWeight:'bold', fontSize:'13px', marginBottom:'5px'}}>{opt.name}</label>
                                <div style={{display:'flex', flexWrap:'wrap', gap:'8px'}}>
                                    {opt.choices.map((choice, cIdx) => (
                                        <div 
                                            key={cIdx}
                                            onClick={() => onChoiceSelect(opt.name, choice)}
                                            style={{
                                                padding:'6px 12px', borderRadius:'8px', border:'1px solid #ccc', fontSize:'12px', cursor:'pointer',
                                                backgroundColor: selectedChoices[opt.name]?.name === choice.name ? '#5A4A42' : 'transparent',
                                                color: selectedChoices[opt.name]?.name === choice.name ? '#fff' : '#333'
                                            }}
                                        >
                                            {choice.name} {choice.extra_price > 0 && `(+${choice.extra_price/1000}k)`}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* QTY */}
                <div className="qty-control">
                    <button className="btn-qty" onClick={() => onQtyChange(-1)}>-</button>
                    <span style={{fontSize:'18px', fontWeight:'bold'}}>{qty}</span>
                    <button className="btn-qty" onClick={() => onQtyChange(1)}>+</button>
                </div>

                {/* NOTES */}
                <div className="notes-section">
                    <label style={{display:'block', fontWeight:'bold', fontSize:'13px', marginBottom:'8px'}}>Catatan</label>
                    <div className="tags-container">
                        {quickNotes.map(tag => (
                            <div key={tag} className={`note-tag ${selectedTags.includes(tag) ? 'selected' : ''}`} onClick={() => onTagToggle(tag)}>{tag}</div>
                        ))}
                    </div>
                    <input type="text" className="note-input" placeholder="Tulis catatan..." value={note} onChange={onNoteChange} />
                </div>

                <button className="btn-add-modal" onClick={onAddToCart}>
                    Tambah - Rp {calculateTotal().toLocaleString('id-ID')}
                </button>
            </div>
        </div>
    );
};

export default MenuModal;