import React from "react";
import { FaShopify, FaSearchengin } from "react-icons/fa6";
import { BsCart4 } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";

function Nav() {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();

  return (
    <div className="nav">
      <div className="top-nav">
        <Link to="/">
          <div className="logo">
            <span>Shop-Ease</span>
            <FaShopify />
          </div>
        </Link>

        <form className="search-box" onSubmit={(e) => e.preventDefault()}>
          <input type="text" placeholder="Search Items.." />
          <button type="submit">
            <FaSearchengin />
          </button>
        </form>

        <div className="nav-actions">
          {user ? (
            <>
              <span className="nav-user">Hi, {user.name}</span>
              <button type="button" className="nav-auth-btn" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="nav-auth-btn">
              Login
            </Link>
          )}

          <Link to="/cart" className="cart" aria-label="Shopping Cart">
            <BsCart4 />
            <span>{totalItems}</span>
          </Link>
        </div>
      </div>

      <div className="bottom-nav">
        <Link to="/">
          <li>Home</li>
        </Link>
        <Link to="/shop">
          <li>Shop</li>
        </Link>
        <Link to="/cart">
          <li>Cart ({totalItems})</li>
        </Link>
        <Link to="/contact">
          <li>Contact</li>
        </Link>
      </div>
    </div>
  );
}

export default Nav;
