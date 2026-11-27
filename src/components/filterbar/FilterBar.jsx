import React from "react";
import "./FilterBar.css";

function FilterBar({
  categories,
  selectedCategory,
  onSelectCategory,
  sortBy,
  onSortChange,
  searchQuery,
  onSearchChange,
}) {
  return (
    <div className="filter-bar">
      <div className="filter-pills">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={`filter-pill ${selectedCategory === cat.name ? "active" : ""}`}
            onClick={() => onSelectCategory(cat.name)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="filter-controls">
        <input
          type="text"
          placeholder="Filter by name..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="filter-search"
        />

        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="filter-select"
          aria-label="Sort products"
        >
          <option value="featured">Sort: Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name-asc">Name: A to Z</option>
        </select>
      </div>
    </div>
  );
}

export default FilterBar;
