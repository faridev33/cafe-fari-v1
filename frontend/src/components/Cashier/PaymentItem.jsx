import React from 'react';

const PaymentItem = ({ item, index, productOptions, onUpdateQty, onUpdatePrice, onUpdateNote, onOptionChange, onDelete }) => {
    return (
        <div style={{borderBottom:'1px dashed #ddd', paddingBottom:'15px', marginBottom:'15px'}}>
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px'}}>
                <strong style={{fontSize:'16px', color:'#2c3e50'}}>{item.name}</strong>
                <strong style={{color:'#28a745'}}>Rp {(item.price * item.quantity).toLocaleString()}</strong>
            </div>

            {/* --- AREA EDIT OPSI --- */}
            {productOptions.length > 0 && (
                <div style={{display:'flex', gap:'15px', flexWrap:'wrap', marginBottom:'10px', background:'white', padding:'10px', borderRadius:'6px', border:'1px solid #eee'}}>
                    {productOptions.map((opt, oIdx) => (
                        <div key={oIdx} style={{minWidth:'120px'}}>
                            <small style={{fontWeight:'bold', color:'#888', display:'block', marginBottom:'3px'}}>{opt.name}:</small>
                            <select 
                                style={{width:'100%', padding:'4px', fontSize:'12px', border:'1px solid #ccc', borderRadius:'4px'}}
                                onChange={(e) => {
                                    const selectedChoice = opt.choices.find(c => c.name === e.target.value);
                                    if(selectedChoice) onOptionChange(index, opt.name, selectedChoice);
                                }}
                                value={item.selectedChoices?.[opt.name]?.name || ''}
                            >
                                <option value="">- Pilih -</option>
                                {opt.choices.map((c, cIdx) => (
                                    <option key={cIdx} value={c.name}>
                                        {c.name} {c.extra_price > 0 && `(+${c.extra_price})`}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ))}
                </div>
            )}

            <div style={{display:'flex', gap:'10px', alignItems:'center'}}>
                {/* Qty Control */}
                <div style={{display:'flex', alignItems:'center', border:'1px solid #ccc', borderRadius:'4px', background:'white'}}>
                    <button onClick={() => onUpdateQty(index, -1)} style={{padding:'5px 10px', border:'none', background:'none', cursor:'pointer'}}>-</button>
                    <span style={{padding:'0 5px', fontSize:'14px', fontWeight:'bold'}}>{item.quantity}</span>
                    <button onClick={() => onUpdateQty(index, 1)} style={{padding:'5px 10px', border:'none', background:'none', cursor:'pointer'}}>+</button>
                </div>

                {/* Manual Note */}
                <input 
                    type="text" 
                    value={item.note || ''} 
                    onChange={(e) => onUpdateNote(index, e.target.value)}
                    placeholder="Catatan Manual..."
                    style={{flex:1, padding:'8px', fontSize:'13px', border:'1px solid #ddd', borderRadius:'4px'}}
                />

                {/* Delete Button */}
                <button 
                    onClick={() => onDelete(index)}
                    style={{background:'#dc3545', color:'white', border:'none', borderRadius:'4px', height:'32px', width:'32px', cursor:'pointer'}}
                >
                    x
                </button>
            </div>
        </div>
    );
};

export default PaymentItem;