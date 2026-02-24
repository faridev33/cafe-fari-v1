import React from 'react';
import '../../styles/Cashier/CashierHistory.css';

const HistoryFilter = (props) => {
    // Destructuring props agar lebih bersih saat dipanggil di bawah
    const { 
        searchTerm, setSearchTerm, 
        filterDate, setFilterDate, 
        sortOrder, setSortOrder, 
        onReset, onToday 
    } = props;

    return (
        <div className="history-controls">
            
            {/* Input Pencarian */}
            <div className="control-group">
                <label className="control-label">Cari:</label>
                <input 
                    type="text" 
                    className="input-filter" 
                    placeholder="No. Meja / Nama Pelanggan..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Input Tanggal */}
            <div className="control-group">
                <label className="control-label">Tanggal:</label>
                <input 
                    type="date" 
                    className="input-filter" 
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                />
            </div>

            {/* Dropdown Sorting */}
            <div className="control-group">
                <label className="control-label">Urutan:</label>
                <select 
                    className="select-filter input-filter" 
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                >
                    <option value="newest">Paling Baru</option>
                    <option value="oldest">Paling Lama</option>
                </select>
            </div>

            {/* Tombol Aksi (Dikelompokkan agar rapi) */}
            <div className="button-group" style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                <button className="btn-today" onClick={onToday}>
                    Hari Ini
                </button>
                
                <button className="btn-reset" onClick={onReset}>
                    Reset
                </button>
            </div>

        </div>
    );
};

export default HistoryFilter;