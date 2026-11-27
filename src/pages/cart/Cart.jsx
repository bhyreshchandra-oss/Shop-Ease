import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import CartItem from "../../components/cartItem/CartItem";
import emptyCartImg from "../../assets/emptycart.png";
import "./Cart.css";

function Cart() {
  const { cartItems, totalItems, subtotal, clearCart } = useCart();

  if (cartItems.length === 0) {
    return (
      <main className="empty-cart">
        <img src={emptyCartImg} alt="Empty cart" />
        <h2>Your cart is empty</h2>
        <p>Add items from Home or Products to get started.</p>
        <Link to="/products" className="shop-now-btn">
          Explore Products
        </Link>
      </main>
    );
  }

  return (
    <main className="cart-page">
      <h1>Shopping Cart ({totalItems} items)</h1>

      <div className="cart-layout">
        <div className="cart-items-list">
          {cartItems.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>

        <aside className="cart-summary">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Items</span>
            <span>{totalItems}</span>
          </div>
          <div className="summary-row">
            <span>Delivery</span>
            <span>Free</span>
          </div>
          <div className="summary-row total">
            <span>Subtotal</span>
            <span>₹{Number(subtotal).toLocaleString("en-IN")}</span>
          </div>

          <Link to="/checkout" className="checkout-btn">
            Proceed to Checkout
          </Link>
          <button type="button" className="clear-cart-btn" onClick={clearCart}>
            Clear Cart
          </button>
        </aside>
      </div>
    </main>
  );
}

export default Cart;
