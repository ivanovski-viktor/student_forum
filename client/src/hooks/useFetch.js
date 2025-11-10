import { useState, useEffect, useCallback } from "react";
import { usePageLoading } from "../context/PageLoadingContext";

export function useFetch(url, options, pageLoading = false) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { setPageLoading } = usePageLoading();

  const fetchData = useCallback(async () => {
    if (!url) return;

    if (pageLoading) setPageLoading(true);
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(url, options);
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      if (pageLoading) setPageLoading(false);
    }
  }, [url, JSON.stringify(options), pageLoading, setPageLoading]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
