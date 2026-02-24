import React from 'react';
import '../../styles/Customer/MenuHeader.css';

const MenuHeader = ({ tableId }) => {
    return (
        <header className="customer-header">
            <h1 className="cafe-title">Cafe Fari.</h1>
            <div className="table-info">Meja {tableId}</div>
        </header>
    );
};

export default MenuHeader;