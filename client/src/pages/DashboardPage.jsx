import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";
import useInactivityLogout from "../hooks/useInactivityLogout";

export default function DashboardPage() {
  const { user, logout, refreshAccount } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    refreshAccount();
  }, []);

  useInactivityLogout(async () => {
    await logout();
    navigate("/login");
  });

  return (
    <div className="app-shell">
      <Header />
      <div className="container">
        <div className="card shadow-sm">
          <div className="card-body">
            <h2 className="card-title mb-3">Welcome, {user?.name}</h2>
            <p className="mb-1">Account Number: {user?.accountNumber}</p>
            <h4 className="text-success">Current Balance: ${Number(user?.balance || 0).toFixed(2)}</h4>
          </div>
        </div>
      </div>
    </div>
  );
}
