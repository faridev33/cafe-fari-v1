import React from 'react';
import { Outlet } from 'react-router-dom';
import "../../styles/Customer/customer.css";

const CustomerLayout = () => {
    return (
        <div className="mobile-wrapper">
            {/* Halaman CustomerMenu akan dirender di sini */}
            <Outlet />
        </div>
    );
};

export default CustomerLayout;