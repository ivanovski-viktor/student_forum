import { useEffect, useState } from "react";

export function useDeleteRequest(url, token) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  let resetState;

  async function exec() {
    setLoading(true);

    try {
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = token;

      const response = await fetch(url, {
        method: "DELETE",
        headers,
      });

      // session expired
      if (response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login"; // redirect
        return;
      }

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Failed to delete");
      }

      setSuccess(true);
      if (response.status !== 204) {
        return await response.json();
      }
      return null;
    } catch (err) {
      setError(err.message || "Something went wrong");
      return null;
    } finally {
      setLoading(false);

      resetState = setTimeout(() => {
        setError(null);
        setSuccess(false);
      }, 3000);
    }
  }

  useEffect(() => {
    return () => clearTimeout(resetState);
  }, []);

  return { exec, loading, error, success };
}
