import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import InlineLoader from "../components/layout/InlineLoader";

export default function MyAccount() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [userData, setUserData] = useState(null); // to store the response data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Redirect if no token
  useEffect(() => {
    if (token == null) {
      navigate("/login");
    }
  }, [token, navigate]);

  // Fetch user data
  useEffect(() => {
    if (!token) return; // Don't run fetch if there's no token

    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8080/users/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            // Token is invalid/expired, redirect to login
            navigate("/login");
          } else {
            throw new Error(`Error ${response.status}`);
          }
        }

        const data = await response.json();
        setUserData(data);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, navigate]);

  if (loading) return <InlineLoader />;

  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>My Account</h2>
      <div className="">{JSON.stringify(userData.user)}</div>
    </div>
  );
}
