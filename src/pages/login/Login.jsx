import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Login.css";

function Login() {
  const { user, register, login, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [statusMessage, setStatusMessage] = useState(null);

  const redirectTo = location.state?.from || "/";

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatusMessage(null);

    if (isRegisterMode) {
      const result = register({ name, email, password });
      setStatusMessage({
        type: result.success ? "success" : "error",
        text: result.message,
      });
      if (result.success) {
        setIsRegisterMode(false);
        setPassword("");
      }
      return;
    }

    const result = login({ email, password });
    if (!result.success) {
      setStatusMessage({ type: "error", text: result.message });
      return;
    }

    navigate(redirectTo, { replace: true });
  };

  if (user) {
    return (
      <main className="login-page">
        <div className="login-card">
          <h2>Signed in</h2>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
          <button type="button" className="login-btn" onClick={logout}>
            Sign Out
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2>
          {isRegisterMode ? "Create Shop-Ease Account" : "Login to Shop-Ease"}
        </h2>

        {statusMessage && (
          <p
            role="status"
            style={{
              fontSize: "13px",
              color:
                statusMessage.type === "error"
                  ? "#d93025"
                  : "var(--accent-brand)",
            }}
          >
            {statusMessage.text}
          </p>
        )}

        {isRegisterMode && (
          <label>
            Full Name
            <input
              type="text"
              required
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
        )}

        <label>
          Email
          <input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label>
          Password
          <input
            type="password"
            required
            minLength={6}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <button type="submit" className="login-btn">
          {isRegisterMode ? "Register Account" : "Sign In"}
        </button>

        <button
          type="button"
          className="login-btn"
          style={{
            backgroundColor: "var(--bg-muted)",
            color: "var(--text-main)",
            border: "1px solid var(--border-color)",
          }}
          onClick={() => {
            setIsRegisterMode((prev) => !prev);
            setStatusMessage(null);
          }}
        >
          {isRegisterMode
            ? "Already registered? Sign In"
            : "New here? Register First"}
        </button>
      </form>
    </main>
  );
}

export default Login;
