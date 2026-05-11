import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const signup = async (payload) => {
    const res = await api.post("/signup", payload);
    setUser(res.data.user);
    return res.data;
  };

  const login = async (pin) => {
    const res = await api.post("/login", { pin });
    setUser(res.data.user);
    return res.data;
  };

  const logout = async () => {
    await api.post("/logout");
    setUser(null);
  };

  const refreshAccount = async () => {
    if (!user?.id) return null;
    const res = await api.get(`/account/${user.id}`);
    setUser((prev) => ({ ...prev, ...res.data.user, id: prev.id }));
    return res.data.user;
  };

  const value = useMemo(
    () => ({ user, setUser, error, setError, loading, signup, login, logout, refreshAccount }),
    [user, error, loading]
  );

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const res = await api.get("/me");
        const restored = res.data.user;
        setUser({
          id: restored.id || restored._id,
          name: restored.name,
          accountNumber: restored.accountNumber,
          balance: restored.balance
        });
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    restoreSession();
  }, []);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
