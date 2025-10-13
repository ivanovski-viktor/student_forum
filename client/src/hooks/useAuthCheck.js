import { useEffect, useState } from "react";

const apiUrl = import.meta.env.VITE_API_URL;

export function useAuthCheck() {
  const [user, setUser] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setChecked(true);
        return;
      }

      try {
        const res = await fetch(`${apiUrl}/users/me`, {
          headers: { Authorization: token },
        });

        if (!res.ok) throw new Error("Invalid token");

        const userData = await res.json();
        setUser(userData);
      } catch {
        localStorage.removeItem("token");
      } finally {
        setChecked(true);
      }
    };

    checkAuth();
  }, []);

  return {
    user,
    checked,
    isAuthenticated: user ? true : false,
  };
}
