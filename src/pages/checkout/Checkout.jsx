import React, { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import "./Checkout.css";

function Checkout() {
  const { cartItems, totalItems, subtotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || "",
    phone: "",
    addressLine: "",
    city: "",
    pincode: "",
    paymentMethod: "COD",
  });
  const [orderPlaced, setOrderPlaced] = useState(null);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (orderPlaced) {
    return (
      <main className="checkout-page">
        <div className="checkout-confirmation">
          <h2>Order Confirmed!</h2>
          <p>
            Thank you, <strong>{orderPlaced.customerName}</strong>. Your order{" "}
            <strong>#{orderPlaced.orderId}</strong> has been placed.
          </p>

          <div className="ordered-items-box">
            <h3>Items Ordered ({orderPlaced.totalItems})</h3>
            {orderPlaced.items.map((item) => (
              <div key={item.id} className="checkout-item-row">
                <img src={item.image} alt={item.name} />
                <div className="checkout-item-meta">
                  <span className="checkout-item-name">{item.name}</span>
                  <span className="checkout-item-qty">
                    Qty: {item.quantity} × ₹
                    {Number(item.price).toLocaleString("en-IN")}
                  </span>
                </div>
                <span className="checkout-item-total">
                  ₹
                  {(Number(item.price) * Number(item.quantity)).toLocaleString(
                    "en-IN",
                  )}
                </span>
              </div>
            ))}
            <div className="checkout-total-row">
              <span>Total Paid ({orderPlaced.paymentMethod})</span>
              <span>
                ₹{Number(orderPlaced.subtotal).toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          <button
            type="button"
            className="place-order-btn"
            onClick={() => navigate("/products")}
          >
            Continue Shopping
          </button>
        </div>
      </main>
    );
  }

  if (cartItems.length === 0) {
    return (
      <main className="checkout-page">
        <div className="checkout-empty">
          <h2>Your cart is empty</h2>
          <p>Add products to your cart before proceeding to checkout.</p>
          <Link to="/products" className="place-order-btn">
            Browse Products
          </Link>
        </div>
      </main>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    const newOrder = {
      orderId: `ORD-${Date.now().toString().slice(-6)}`,
      userEmail: user.email,
      customerName: shippingAddress.fullName,
      shippingAddress,
      paymentMethod: shippingAddress.paymentMethod,
      items: cartItems,
      totalItems,
      subtotal,
      placedAt: new Date().toISOString(),
    };

    const ordersKey = `shopease_orders_${user.email.toLowerCase()}`;
    const existingOrders = JSON.parse(localStorage.getItem(ordersKey) || "[]");
    localStorage.setItem(
      ordersKey,
      JSON.stringify([newOrder, ...existingOrders]),
    );

    clearCart();
    setOrderPlaced(newOrder);
  };

  return (
    <main className="checkout-page">
      <h1>Checkout</h1>

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handlePlaceOrder}>
          <h2>Delivery Details</h2>

          <label>
            Full Name
            <input
              type="text"
              name="fullName"
              required
              value={shippingAddress.fullName}
              onChange={handleChange}
            />
          </label>

          <label>
            Phone Number
            <input
              type="tel"
              name="phone"
              required
              placeholder="10-digit mobile number"
              value={shippingAddress.phone}
              onChange={handleChange}
            />
          </label>

          <label>
            Address
            <textarea
              name="addressLine"
              rows="3"
              required
              placeholder="House no., street, area"
              value={shippingAddress.addressLine}
              onChange={handleChange}
            />
          </label>

          <div className="checkout-row-two">
            <label>
              City
              <input
                type="text"
                name="city"
                required
                value={shippingAddress.city}
                onChange={handleChange}
              />
            </label>

            <label>
              Pincode
              <input
                type="text"
                name="pincode"
                required
                value={shippingAddress.pincode}
                onChange={handleChange}
              />
            </label>
          </div>

          <label>
            Payment Method
            <select
              name="paymentMethod"
              value={shippingAddress.paymentMethod}
              onChange={handleChange}
            >
              <option value="COD">Cash on Delivery (COD)</option>
              <option value="UPI">UPI</option>
              <option value="Card">Credit / Debit Card</option>
            </select>
          </label>

          <button type="submit" className="place-order-btn">
            Place Order (₹{Number(subtotal).toLocaleString("en-IN")})
          </button>
        </form>

        <aside className="checkout-summary">
          <h2>Order Items ({totalItems})</h2>

          <div className="checkout-items-list">
            {cartItems.map((item) => (
              <div key={item.id} className="checkout-item-row">
                <img src={item.image} alt={item.name} />
                <div className="checkout-item-meta">
                  <span className="checkout-item-name">{item.name}</span>
                  <span className="checkout-item-qty">
                    Qty: {item.quantity} × ₹
                    {Number(item.price).toLocaleString("en-IN")}
                  </span>
                </div>
                <span className="checkout-item-total">
                  ₹
                  {(Number(item.price) * Number(item.quantity)).toLocaleString(
                    "en-IN",
                  )}
                </span>
              </div>
            ))}
          </div>

          <div className="checkout-summary-totals">
            <div className="summary-line">
              <span>Items ({totalItems})</span>
              <span>₹{Number(subtotal).toLocaleString("en-IN")}</span>
            </div>
            <div className="summary-line">
              <span>Delivery</span>
              <span>Free</span>
            </div>
            <div className="summary-line grand-total">
              <span>Total Payable</span>
              <span>₹{Number(subtotal).toLocaleString("en-IN")}</span>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

export default Checkout;
