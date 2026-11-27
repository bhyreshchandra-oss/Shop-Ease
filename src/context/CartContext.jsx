import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useRef,
} from "react";
import { cartReducer, initialCartState } from "../reducers/cartReducer";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);
const CART_STORAGE_PREFIX = "shopease_cart_v1_";

function readCartFromStorage(storageKey) {
  if (!storageKey) return initialCartState;
  try {
    const saved = localStorage.getItem(storageKey);
    if (!saved) return initialCartState;
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed?.items)
      ? { items: parsed.items }
      : initialCartState;
  } catch {
    return initialCartState;
  }
}

export function CartProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const storageKey =
    isAuthenticated && user?.email
      ? `${CART_STORAGE_PREFIX}${user.email.trim().toLowerCase()}`
      : null;

  const [state, dispatch] = useReducer(
    cartReducer,
    initialCartState,
    (init) => readCartFromStorage(storageKey) || init,
  );

  // Track which storageKey is currently hydrated so we don't overwrite a user's
  // saved cart with initialCartState during key transitions.
  const hydratedKeyRef = useRef(storageKey);

  useEffect(() => {
    const loadedCart = readCartFromStorage(storageKey);
    dispatch({ type: "SET_CART", payload: loadedCart });
    hydratedKeyRef.current = storageKey;
  }, [storageKey]);

  useEffect(() => {
    if (!storageKey || hydratedKeyRef.current !== storageKey) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch (err) {
      console.error("Failed to persist cart:", err);
    }
  }, [state, storageKey]);

  const activeItems = isAuthenticated ? state.items : [];

  const totalItems = activeItems.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0),
    0,
  );

  const subtotal = activeItems.reduce(
    (sum, item) =>
      sum + (Number(item.price) || 0) * (Number(item.quantity) || 0),
    0,
  );

  const addToCart = (product, quantity = 1) => {
    if (!isAuthenticated || !product) {
      return false;
    }

    const normalizedProduct = {
      ...product,
      price: Number(product.price) || 0,
      quantity: Math.max(1, Number(quantity) || 1),
    };

    dispatch({ type: "ADD_ITEM", payload: normalizedProduct });
    return true;
  };

  const removeFromCart = (id) => {
    if (!isAuthenticated) return;
    dispatch({ type: "REMOVE_ITEM", payload: id });
  };

  const updateQty = (id, quantity) => {
    if (!isAuthenticated) return;
    dispatch({ type: "UPDATE_QTY", payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
    if (storageKey) {
      localStorage.removeItem(storageKey);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems: activeItems,
        totalItems,
        subtotal,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
