import React, { useState, useEffect } from 'react';
import TableList from '../../components/SuperAdmin/Table/TableList';
import { getTables } from '../../services/tableApi';
import '../../styles/SuperAdmin/Table/TableStyles.css';

const TablePage = () => {
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const data = await getTables();
            // Sortir meja berdasarkan nomor agar rapi (1, 2, 3...)
            const sortedData = data.sort((a, b) => a.number - b.number);
            setTables(sortedData);
        } catch (error) {
            console.error("Error fetching tables", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-wrapper">
            {/* Header halaman dihapus disini karena sudah ada di dalam TableList */}
            
            {loading ? (
                <p style={{textAlign:'center', marginTop:'50px'}}>Loading data meja...</p>
            ) : (
                <TableList tables={tables} refreshData={fetchData} />
            )}
        </div>
    );
};

export default TablePage;