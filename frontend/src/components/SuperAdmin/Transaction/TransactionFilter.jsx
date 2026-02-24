import React from 'react';
import '../../../styles/SuperAdmin/Transaction/TransactionFilter.css';

const TransactionFilter = (props) => {
    const { 
        startDate, setStartDate, endDate, setEndDate, 
        sortOrder, setSortOrder, 
        onToday, onThisWeek, onThisMonth, onReset 
    } = props;

    return (
        <div className="filter-container">
            {/* Tombol Cepat */}
            <div className="quick-btn-group">
                <button onClick={onToday} className="btn-filter-quick">Hari Ini</button>
                <button onClick={onThisWeek} className="btn-filter-quick">Minggu Ini</button>
                <button onClick={onThisMonth} className="btn-filter-quick">Bulan Ini</button>
            </div>

            {/* Input Rentang Tanggal */}
            <div className="date-range-group">
                <div>
                    <label className="input-label">Dari:</label>
                    <input 
                        type="date" 
                        value={startDate} 
                        onChange={(e) => setStartDate(e.target.value)} 
                        className="input-date"
                    />
                </div>
                <span style={{paddingTop:'15px'}}>-</span>
                <div>
                    <label className="input-label">Sampai:</label>
                    <input 
                        type="date" 
                        value={endDate} 
                        onChange={(e) => setEndDate(e.target.value)} 
                        className="input-date"
                    />
                </div>
            </div>

            {/* Sorting & Reset */}
            <div className="control-group-right">
                <div>
                    <label className="input-label">Urutan:</label>
                    <select 
                        value={sortOrder} 
                        onChange={(e) => setSortOrder(e.target.value)} 
                        className="input-select"
                    >
                        <option value="newest">Terbaru</option>
                        <option value="oldest">Terlama</option>
                    </select>
                </div>
                <div style={{display:'flex', alignItems:'end'}}>
                    <button onClick={onReset} className="btn-reset">Reset</button>
                </div>
            </div>
        </div>
    );
};

export default TransactionFilter;