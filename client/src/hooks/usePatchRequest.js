import { useState } from "react";

export function usePatchRequest(url, token) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  async function exec(body) {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(body),
      });

      // Handle unauthorized
      if (res.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login"; // redirect
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Request failed");
      }

      setSuccess(true);
      return await res.json();
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { exec, loading, error, success };
}
