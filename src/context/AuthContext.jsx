import React, { createContext, useContext } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

const AuthContext = createContext(null);
const REGISTERED_USERS_KEY = "shopease_registered_users";

export function AuthProvider({ children }) {
  const [user, setUser] = useLocalStorage("shopease_user", null);
  const [registeredUsers, setRegisteredUsers] = useLocalStorage(
    REGISTERED_USERS_KEY,
    [],
  );

  const register = ({ name, email, password }) => {
    const normalizedEmail = email.trim().toLowerCase();
    const cleanName =
      name?.trim() ||
      normalizedEmail.split("@")[0].replace(/[._-]/g, " ") ||
      "Shopper";

    const exists = registeredUsers.some(
      (account) => account.email.toLowerCase() === normalizedEmail,
    );
    if (exists) {
      return {
        success: false,
        message: "An account with this email already exists. Please sign in.",
      };
    }

    const newAccount = {
      id: Date.now(),
      name: cleanName,
      email: normalizedEmail,
      password,
      createdAt: new Date().toISOString(),
    };

    setRegisteredUsers((prev) => [...prev, newAccount]);
    return {
      success: true,
      message: "Account registered. Sign in with your email and password.",
    };
  };

  const login = ({ email, password }) => {
    const normalizedEmail = email.trim().toLowerCase();
    const matched = registeredUsers.find(
      (account) =>
        account.email.toLowerCase() === normalizedEmail &&
        account.password === password,
    );

    if (!matched) {
      return {
        success: false,
        message: "Invalid email or password. Register first if you are new.",
      };
    }

    setUser({
      id: matched.id,
      name: matched.name,
      email: matched.email,
      loggedInAt: new Date().toISOString(),
    });

    return { success: true };
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        registeredUsers,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
