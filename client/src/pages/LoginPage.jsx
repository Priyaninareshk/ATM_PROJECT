import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!/^\d{4}$/.test(pin)) {
      setError("PIN must be exactly 4 digits.");
      return;
    }

    try {
      await login(pin);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="card auth-card shadow">
        <div className="card-body">
          <h3 className="mb-3">ATM Login</h3>
          <form onSubmit={handleSubmit}>
            <label htmlFor="pin" className="form-label">
              Enter 4-Digit PIN
            </label>
            <input
              id="pin"
              className="form-control mb-3"
              type="password"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
            />
            {error && <div className="alert alert-danger py-2">{error}</div>}
            <button className="btn btn-primary w-100" type="submit">
              Login
            </button>
          </form>
          <p className="mt-3 mb-0">
            New user? <Link to="/signup">Create account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
