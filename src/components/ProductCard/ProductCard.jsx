import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import "./ProductCard.css";

function ProductCard({ product, id, name, image, price, category }) {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [added, setAdded] = useState(false);

  // Supports both <ProductCard product={item} /> and individual props
  const item = product || { id, name, image, price, category };

  if (!item || !item.name) return null;

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const wasAdded = addToCart(item, 1);
    if (!wasAdded) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    setAdded(true);
    setTimeout(() => setAdded(false), 900);
  };

  return (
    <div className="product">
      <Link to={`/product/${item.id}`} className="product-image-link">
        <img src={item.image} alt={item.name} />
      </Link>
      <div className="product-details">
        {item.category && <span className="category-tag">{item.category}</span>}
        <Link to={`/product/${item.id}`} className="name">
          {item.name}
        </Link>
        <span className="price">
          ₹{Number(item.price).toLocaleString("en-IN")}/-
        </span>
        <button type="button" onClick={handleAdd}>
          {!isAuthenticated ? "Login to Add" : added ? "Added ✓" : "Add +"}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
