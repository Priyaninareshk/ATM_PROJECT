import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg atm-nav px-3 mb-4">
      <span className="navbar-brand text-white fw-bold">Secure ATM</span>
      <div className="navbar-nav me-auto">
        <Link className="nav-link text-white" to="/dashboard">
          Dashboard
        </Link>
        <Link className="nav-link text-white" to="/transaction">
          Transaction
        </Link>
        <Link className="nav-link text-white" to="/history">
          History
        </Link>
      </div>
      <div className="text-white small me-3">{user?.name}</div>
      <button type="button" className="btn btn-outline-light btn-sm" onClick={handleLogout}>
        Logout
      </button>
    </nav>
  );
}
