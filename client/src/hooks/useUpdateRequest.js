import { useEffect, useState } from "react";

export function useUpdateRequest(url, token, data) {
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
        method: "PUT",
        headers,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Failed to update");
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
