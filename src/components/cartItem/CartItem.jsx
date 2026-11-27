import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import "./CartItem.css";

function CartItem({ item }) {
  const { updateQty, removeFromCart } = useCart();

  if (!item) return null;

  const unitPrice = Number(item.price) || 0;
  const quantity = Number(item.quantity) || 1;
  const lineTotal = unitPrice * quantity;

  return (
    <div className="cart-item">
      <Link to={`/product/${item.id}`} className="cart-item-img">
        <img src={item.image} alt={item.name} />
      </Link>

      <div className="cart-item-info">
        <Link to={`/product/${item.id}`} className="cart-item-title">
          {item.name}
        </Link>
        {item.category && (
          <span className="cart-item-category">{item.category}</span>
        )}
        <span className="cart-item-unit-price">
          ₹{unitPrice.toLocaleString("en-IN")} each
        </span>
      </div>

      <div className="cart-item-controls">
        <button
          type="button"
          onClick={() => updateQty(item.id, quantity - 1)}
          aria-label="Decrease quantity"
        >
          -
        </button>
        <span>{quantity}</span>
        <button
          type="button"
          onClick={() => updateQty(item.id, quantity + 1)}
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>

      <div className="cart-item-subtotal">
        ₹{lineTotal.toLocaleString("en-IN")}
      </div>

      <button
        type="button"
        className="remove-item-btn"
        onClick={() => removeFromCart(item.id)}
      >
        Remove
      </button>
    </div>
  );
}

export default CartItem;
