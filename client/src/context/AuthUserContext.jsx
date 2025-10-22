import { createContext, useContext, useState, useEffect } from "react";

const AuthUserContext = createContext();
const apiUrl = import.meta.env.VITE_API_URL;

export default function AuthUserContextProvider({ children }) {
  const [authUser, setAuthUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkedAuth, setCheckedAuth] = useState(false);

  async function checkAuth() {
    const token = localStorage.getItem("token");
    if (!token) {
      setAuthUser(null);
      setIsAuthenticated(false);
      setCheckedAuth(true);
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/users/me`, {
        headers: { Authorization: token },
      });

      if (!res.ok) throw new Error("Invalid token");

      const userData = await res.json();
      setAuthUser(userData);
      setIsAuthenticated(true);
    } catch (err) {
      console.warn("Auth check failed:", err.message);
      localStorage.removeItem("token");
      setAuthUser(null);
      setIsAuthenticated(false);
    } finally {
      setCheckedAuth(true);
    }
  }

  useEffect(() => {
    checkAuth(); // Run once on mount
    const interval = setInterval(checkAuth, 600_000); // Recheck every 10 minutes
    return () => clearInterval(interval);
  }, []);

  return (
    <AuthUserContext.Provider
      value={{
        authUser,
        setAuthUser,
        isAuthenticated,
        setIsAuthenticated,
        checkedAuth,
        checkAuth,
      }}
    >
      {children}
    </AuthUserContext.Provider>
  );
}

export function useAuthUser() {
  return useContext(AuthUserContext);
}
