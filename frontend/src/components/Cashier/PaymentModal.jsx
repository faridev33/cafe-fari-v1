import React from 'react';
import PaymentItem from './PaymentItem';

const PaymentModal = (props) => {
    const { 
        selectedOrder, 
        itemOptionsMap,
        cashDisplay, 
        change, 
        cashRaw,
        onClose, 
        onUpdateQty, 
        onUpdateNote, 
        onOptionChange, 
        onDeleteItem,
        onCashInput, 
        onProcessPayment 
    } = props;

    if (!selectedOrder) return null;

    return (
        <div style={{
            position:'fixed', top:0, left:0, right:0, bottom:0,
            background:'rgba(0,0,0,0.6)', display:'flex', justifyContent:'center', alignItems:'center', zIndex:1000
        }}>
            <div style={{background:'white', padding:'25px', borderRadius:'12px', width:'800px', maxWidth:'95%', maxHeight:'90vh', overflowY:'auto'}}>
                
                {/* Header */}
                <div style={{display:'flex', justifyContent:'space-between', borderBottom:'1px solid #eee', paddingBottom:'10px', marginBottom:'15px'}}>
                    <h3 style={{margin:0}}>Kasir: Meja {selectedOrder.table_id}</h3>
                    <button onClick={onClose} style={{background:'none', border:'none', fontSize:'20px', cursor:'pointer'}}>&times;</button>
                </div>

                {/* LIST ITEM (Menggunakan Komponen PaymentItem) */}
                <div style={{background:'#f8f9fa', padding:'15px', borderRadius:'8px', marginBottom:'20px', maxHeight:'400px', overflowY:'auto'}}>
                    {selectedOrder.items.map((item, idx) => (
                        <PaymentItem 
                            key={idx}
                            index={idx}
                            item={item}
                            productOptions={itemOptionsMap[item.id] || []}
                            onUpdateQty={onUpdateQty}
                            onUpdateNote={onUpdateNote}
                            onOptionChange={onOptionChange}
                            onDelete={onDeleteItem}
                        />
                    ))}
                </div>

                {/* SUMMARY & INPUT UANG */}
                <div style={{background:'#eee', padding:'20px', borderRadius:'10px'}}>
                    <div style={{display:'flex', justifyContent:'space-between', marginBottom:'15px'}}>
                        <span style={{fontSize:'18px', fontWeight:'bold'}}>Total Tagihan</span>
                        <span style={{fontSize:'24px', fontWeight:'bold', color:'#2c3e50'}}>Rp {selectedOrder.total_price.toLocaleString('id-ID')}</span>
                    </div>

                    <div style={{display:'flex', gap:'15px', alignItems:'center', marginBottom:'10px'}}>
                        <label style={{width:'120px', fontWeight:'bold'}}>Uang Diterima:</label>
                        <input 
                            type="text" value={cashDisplay} onChange={onCashInput} placeholder="0" autoFocus
                            style={{flex:1, padding:'12px', fontSize:'18px', fontWeight:'bold', border:'1px solid #ccc', borderRadius:'6px', textAlign:'right'}}
                        />
                    </div>

                    <div style={{display:'flex', gap:'15px', alignItems:'center'}}>
                        <label style={{width:'120px', fontWeight:'bold'}}>Kembalian:</label>
                        <input 
                            type="text" value={change >= 0 ? change.toLocaleString('id-ID') : '-'} disabled
                            style={{flex:1, padding:'12px', fontSize:'18px', fontWeight:'bold', border:'none', borderRadius:'6px', textAlign:'right', background: change >= 0 ? '#d4edda' : '#f8d7da', color: change >= 0 ? '#155724' : '#721c24'}}
                        />
                    </div>
                </div>

                {/* FOOTER BUTTONS */}
                <div style={{marginTop:'20px', display:'flex', gap:'10px'}}>
                    <button onClick={onClose} style={{flex:1, padding:'15px', background:'#6c757d', color:'white', border:'none', borderRadius:'6px', cursor:'pointer', fontWeight:'bold'}}>BATAL</button>
                    <button 
                        onClick={onProcessPayment}
                        disabled={cashRaw < selectedOrder.total_price}
                        style={{flex:2, padding:'15px', border:'none', borderRadius:'6px', cursor:'pointer', fontWeight:'bold', fontSize:'16px', background: (cashRaw < selectedOrder.total_price) ? '#ccc' : '#28a745', color: 'white'}}
                    >
                        {cashRaw < selectedOrder.total_price ? 'UANG KURANG' : 'SELESAI & CETAK STRUK'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;