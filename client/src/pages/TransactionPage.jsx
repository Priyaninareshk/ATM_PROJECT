import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";
import useInactivityLogout from "../hooks/useInactivityLogout";
import api from "../services/api";

export default function TransactionPage() {
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("deposit");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { logout, refreshAccount } = useAuth();
  const navigate = useNavigate();

  useInactivityLogout(async () => {
    await logout();
    navigate("/login");
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const parsed = Number(amount);
    if (!parsed || parsed <= 0) {
      setError("Enter a valid amount greater than 0.");
      return;
    }

    try {
      const res = await api.post(`/transaction/${type}`, { amount: parsed });
      await refreshAccount();
      setMessage(res.data.message);
      setAmount("");
    } catch (err) {
      setError(err.response?.data?.message || "Transaction failed");
    }
  };

  return (
    <div className="app-shell">
      <Header />
      <div className="container">
        <div className="card shadow-sm">
          <div className="card-body">
            <h3 className="mb-3">Make a Transaction</h3>
            <form onSubmit={handleSubmit}>
              <select className="form-select mb-3" value={type} onChange={(e) => setType(e.target.value)}>
                <option value="deposit">Deposit</option>
                <option value="withdraw">Withdraw</option>
              </select>
              <input
                className="form-control mb-3"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              {message && <div className="alert alert-success py-2">{message}</div>}
              {error && <div className="alert alert-danger py-2">{error}</div>}
              <button className="btn btn-primary">Submit</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
