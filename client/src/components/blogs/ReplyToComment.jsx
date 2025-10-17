import { useState } from "react";
import { useParams } from "react-router-dom";
import { useAuthCheck } from "../../hooks/useAuthCheck";
import Input from "../ui/Input";
import Button from "../ui/Button";
import LinkUnderline from "../ui/LinkUnderline";

const apiUrl = import.meta.env.VITE_API_URL;

export default function ReplyToComment({ handleReplyAdded, commentId }) {
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
  if (!checked) return null;
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-between pl-5 py-3 border-stroke/80 rounded-md text-xs border-b">
        <span>Најави се за да одговориш...</span>
        <LinkUnderline to="/login" text="Кон најава" />
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="relative mt-2">
        <Input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={loading}
          placeholder="Одговори..."
        />
        <Button
          extraClass="shrink-0 !mt-0 !py-1.5 px-3 lg:px-4 absolute top-1 right-1 text-xs"
          buttonType="form"
          text="Продолжи"
        />
      </form>
      {error && <p className="text-error text-xs">{error}</p>}
    </div>
  );
}
