import React, { useState } from 'react';
import QRCodeModal from './QRCodeModal';
import { createTable, deleteTable } from '../../../services/tableApi';
import '../../../styles/SuperAdmin/Table/TableStyles.css';

const TableList = ({ tables, refreshData }) => {
    const [selectedTable, setSelectedTable] = useState(null); // Untuk Modal QR
    const [showAddForm, setShowAddForm] = useState(false);
    
    // State Form Tambah Meja
    const [newTable, setNewTable] = useState({ number: '', capacity: 4 });

    const handleAddTable = async (e) => {
        e.preventDefault();
        try {
            await createTable(newTable);
            alert("Meja berhasil ditambahkan!");
            setShowAddForm(false);
            setNewTable({ number: '', capacity: 4 });
            refreshData();
        } catch (error) {
            alert("Gagal menambah meja. Nomor mungkin sudah ada.");
        }
    };

    const handleDelete = async (id) => {
        if(window.confirm("Hapus meja ini?")) {
            await deleteTable(id);
            refreshData();
        }
    }

    return (
        <div className="table-container">
            <div className="header-action">
                <h2>Daftar Meja</h2>
                <button className="btn-add" onClick={() => setShowAddForm(true)}>+ Tambah Meja</button>
            </div>

            {/* Modal Form Tambah Meja */}
            {showAddForm && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <h3 style={{marginBottom:'20px'}}>Tambah Meja Baru</h3>
                        <form onSubmit={handleAddTable}>
                            <div className="form-group">
                                <label>Nomor Meja</label>
                                <input 
                                    type="number" required placeholder="Contoh: 1"
                                    value={newTable.number}
                                    onChange={(e) => setNewTable({...newTable, number: e.target.value})}
                                />
                            </div>
                            <div className="form-group">
                                <label>Kapasitas (Orang)</label>
                                <input 
                                    type="number" required placeholder="Contoh: 4"
                                    value={newTable.capacity}
                                    onChange={(e) => setNewTable({...newTable, capacity: e.target.value})}
                                />
                            </div>
                            <div style={{display:'flex', gap:'10px', marginTop:'20px'}}>
                                <button type="button" className="btn-secondary" style={{flex:1}} onClick={() => setShowAddForm(false)}>Batal</button>
                                <button type="submit" className="btn-add" style={{flex:1}}>Simpan</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* TABEL LIST MEJA */}
            <div className="table-responsive">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th style={{width: '10%'}}>No. Meja</th>
                            <th style={{width: '20%'}}>Kapasitas</th>
                            <th style={{width: '20%'}}>QR Code</th>
                            <th style={{width: '20%'}}>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tables.length > 0 ? (
                            tables.map(table => (
                                <tr key={table.id}>
                                    <td style={{fontWeight: 'bold', fontSize:'1.1em'}}>
                                        Meja {table.number}
                                    </td>
                                    <td>
                                        {table.capacity} Orang
                                    </td>
                                    <td>
                                        <button className="btn-qr" onClick={() => setSelectedTable(table)}>
                                            📷 Lihat QR
                                        </button>
                                    </td>
                                    <td>
                                        <button className="btn-del" onClick={() => handleDelete(table.id)}>
                                            Hapus
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" style={{textAlign: 'center', padding: '30px', color: '#888'}}>
                                    Belum ada data meja. Silakan tambah meja baru.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal QR Code (Pop Up) */}
            {selectedTable && (
                <QRCodeModal 
                    table={selectedTable} 
                    onClose={() => setSelectedTable(null)} 
                />
            )}
        </div>
    );
};

export default TableList;