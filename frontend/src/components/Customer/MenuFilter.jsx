import React from 'react';
import '../../styles/Customer/MenuFilter.css';

const MenuFilter = ({ activeCategory, setActiveCategory, searchQuery, setSearchQuery }) => {
    const categories = ['Semua', 'Makanan', 'Minuman', 'Snack', 'Dessert'];

    return (
        <>
            <div className="search-container">
                <input 
                    type="text" 
                    className="search-input" 
                    placeholder="Mau makan apa hari ini?" 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                />
            </div>

            <div className="category-scroll">
                {categories.map((cat) => (
                    <div 
                        key={cat} 
                        className={`cat-pill ${activeCategory === cat ? 'active' : ''}`} 
                        onClick={() => setActiveCategory(cat)}
                    >
                        {cat}
                    </div>
                ))}
            </div>
        </>
    );
};

export default MenuFilter;