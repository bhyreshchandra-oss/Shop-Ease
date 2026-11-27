import React, { useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { dummydata } from "../../assets/dummydata";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import "./ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [qty, setQty] = useState(1);

  const product = dummydata.find((item) => String(item.id) === String(id));

  if (!product) {
    return (
      <main className="details-not-found">
        <h2>Product not found</h2>
        <Link to="/products">Back to Products</Link>
      </main>
    );
  }

  const handleAddToCart = () => {
    const added = addToCart(product, qty);
    if (!added) {
      navigate("/login", { state: { from: location.pathname } });
    }
  };

  const handleAddAndGoCart = () => {
    const added = addToCart(product, qty);
    if (!added) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    navigate("/cart");
  };

  return (
    <main className="product-details-page">
      <Link to="/products" className="back-link">
        ← Back to Products
      </Link>

      <div className="details-card">
        <div className="details-image-box">
          <img src={product.image} alt={product.name} />
        </div>

        <div className="details-info">
          <span className="details-category">{product.category}</span>
          <h1>{product.name}</h1>
          <p className="details-price">
            ₹{Number(product.price).toLocaleString("en-IN")}
          </p>
          <p className="details-desc">
            Genuine {product.name} in {product.category}. Fast delivery, easy
            returns, and quality assurance with Shop-Ease.
          </p>

          <div className="qty-row">
            <label htmlFor="detail-qty">Quantity:</label>
            <input
              id="detail-qty"
              type="number"
              min="1"
              max="20"
              value={qty}
              onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
            />
          </div>

          <div className="details-actions">
            <button
              type="button"
              className="btn-primary"
              onClick={handleAddToCart}
            >
              {isAuthenticated ? "Add to Cart" : "Login to Add to Cart"}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={handleAddAndGoCart}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ProductDetails;
