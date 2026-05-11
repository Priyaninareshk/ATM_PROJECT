import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";
import useInactivityLogout from "../hooks/useInactivityLogout";
import api from "../services/api";

export default function HistoryPage() {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useInactivityLogout(async () => {
    await logout();
    navigate("/login");
  });

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get(`/transactions/${user.id}`);
        setTransactions(res.data.transactions || []);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load transaction history.");
      }
    };
    fetchHistory();
  }, [user?.id]);

  return (
    <div className="app-shell">
      <Header />
      <div className="container">
        <div className="card shadow-sm">
          <div className="card-body">
            <h3 className="mb-3">Recent Transactions</h3>
            {error && <div className="alert alert-danger py-2">{error}</div>}
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Balance After</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx._id}>
                      <td>{new Date(tx.createdAt).toLocaleString()}</td>
                      <td className="text-capitalize">{tx.type}</td>
                      <td>${Number(tx.amount).toFixed(2)}</td>
                      <td>${Number(tx.balanceAfter).toFixed(2)}</td>
                    </tr>
                  ))}
                  {transactions.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center text-muted">
                        No transactions yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
