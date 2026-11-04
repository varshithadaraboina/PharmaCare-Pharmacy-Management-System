
import React, { useState } from "react";
import { Pill, LockKeyhole, User, Eye, EyeOff, ArrowLeft } from "lucide-react";
import "./Login.css";

function Login({ onLogin, onBack }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (username === "admin" && password === "admin123") {
      onLogin();
    } else {
      setError("Invalid username or password.");
    }
  }

  return (
    <div className="login-page">

      <div className="login-left">
        <button className="back-button" onClick={onBack}>
          <ArrowLeft size={18} /> Back to Home
        </button>

        <div className="login-brand">
          <div className="login-logo">
            <Pill size={30} />
          </div>
          <h2>PharmaCare</h2>
          <span>PHARMACY MANAGEMENT SYSTEM</span>
        </div>

        <div className="login-message">
          <h1>Welcome Back!</h1>
          <p>
            Manage your pharmacy operations, monitor inventory
            and track sales from one place.
          </p>
        </div>

        <div className="login-decoration">
          <Pill size={85} />
        </div>

        <span className="login-copyright">
          © 2026 PharmaCare. All Rights Reserved.
        </span>
      </div>

      <div className="login-right">
        <div className="login-card">

          <div className="login-card-icon">
            <LockKeyhole size={28} />
          </div>

          <h2>Admin Login</h2>
          <p className="login-subtitle">
            Enter your credentials to access your dashboard.
          </p>

          <form onSubmit={handleSubmit}>

            <label>Username</label>
            <div className="login-input">
              <User size={19} />
              <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
            </div>

            <label>Password</label>
            <div className="login-input">
              <LockKeyhole size={19} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>

            {error && <div className="login-error">{error}</div>}

            <button type="submit" className="login-submit">
              Login to Dashboard
            </button>

          </form>

          <div className="login-demo">
            <strong>Demo Login Credentials</strong>
            <p>Username: admin</p>
            <p>Password: admin123</p>
          </div>

        </div>
      </div>

    </div>
  );
}

export default Login;
