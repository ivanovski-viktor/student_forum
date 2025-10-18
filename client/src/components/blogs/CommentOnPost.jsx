import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuthCheck } from "../../hooks/useAuthCheck";
import CommentForm from "./CommentForm";
import LogInCta from "./LogInCta";
const apiUrl = import.meta.env.VITE_API_URL;

export default function CommentOnPost() {
  const { id } = useParams();
  const { isAuthenticated, checked } = useAuthCheck({
    redirectIfUnauthenticated: true,
  });

  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${apiUrl}/posts/${id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) throw new Error("Failed to post comment");

      setContent("");
      window.location.reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Wait for auth check
  if (!checked) return null;
  // Show login prompt for unauthenticated users
  if (!isAuthenticated) {
    return <LogInCta />;
  }

  return (
    <CommentForm
      loading={loading}
      handleSubmit={handleSubmit}
      content={content}
      setContent={setContent}
      error={error}
    />
  );
}
