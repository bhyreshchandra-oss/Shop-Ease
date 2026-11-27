import React, { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { dummydata } from "../../assets/dummydata";
import { category } from "../../assets/Category";
import ProductCard from "../../components/ProductCard/ProductCard.jsx";
import "./Products.css";

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "All";

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchTerm, setSearchTerm] = useState(initialSearch);

  const filteredProducts = useMemo(() => {
    return dummydata.filter((item) => {
      const matchesCategory =
        selectedCategory === "All" ||
        item.category?.toLowerCase() === selectedCategory.toLowerCase();

      const matchesSearch =
        !searchTerm.trim() ||
        item.name?.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
        item.category?.toLowerCase().includes(searchTerm.trim().toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchTerm]);

  const handleCategoryChange = (catName) => {
    setSelectedCategory(catName);
    const next = new URLSearchParams(searchParams);
    if (catName === "All") {
      next.delete("category");
    } else {
      next.set("category", catName);
    }
    setSearchParams(next);
  };

  return (
    <main className="products-page">
      <div className="products-header">
        <h1>All Products</h1>
        <input
          type="text"
          className="products-filter-input"
          placeholder="Filter by product name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="category-pills">
        <button
          type="button"
          className={selectedCategory === "All" ? "pill active" : "pill"}
          onClick={() => handleCategoryChange("All")}
        >
          All
        </button>
        {category.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={
              selectedCategory.toLowerCase() === cat.name.toLowerCase()
                ? "pill active"
                : "pill"
            }
            onClick={() => handleCategoryChange(cat.name)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {filteredProducts.length === 0 ? (
        <p className="no-results">No products match your current filter.</p>
      ) : (
        <section className="products-grid">
          {filteredProducts.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </section>
      )}
    </main>
  );
}

export default Products;
