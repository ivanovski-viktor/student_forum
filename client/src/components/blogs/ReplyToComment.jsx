import { useState } from "react";
import { useParams } from "react-router-dom";
import CommentForm from "./CommentForm";
import LogInCta from "./LogInCta";
import { useAuthUser } from "../../context/AuthUserContext";

const apiUrl = import.meta.env.VITE_API_URL;

export default function ReplyToComment({ handleReplyAdded, commentId }) {
  const { id } = useParams();
  const { isAuthenticated, checkedAuth } = useAuthUser();

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
        body: JSON.stringify({ content, parent_id: commentId }),
      });

      if (!res.ok) throw new Error("Failed to post reply");

      setContent("");
      handleReplyAdded();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Wait for auth check
  if (!checkedAuth) return null;
  if (!isAuthenticated) {
    return <LogInCta text="Најави се за да одговориш..." />;
  }

  return (
    <CommentForm
      loading={loading}
      handleSubmit={handleSubmit}
      content={content}
      setContent={setContent}
      error={error}
      placeholder="Одговори..."
    />
  );
}
