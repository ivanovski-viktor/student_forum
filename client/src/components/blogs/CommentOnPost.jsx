import { useState } from "react";
import { useParams } from "react-router-dom";
import CommentForm from "./CommentForm";
import LogInCta from "./LogInCta";
import { usePostRequest } from "../../hooks/usePostRequest";
import { useAuthUser } from "../../context/AuthUserContext";

const apiUrl = import.meta.env.VITE_API_URL;

export default function CommentOnPost({ onCommentPosted }) {
  const { id } = useParams();
  const { isAuthenticated, checkedAuth } = useAuthUser();

  const [content, setContent] = useState("");

  const { exec, loading, error } = usePostRequest(
    `${apiUrl}/posts/${id}/comments`,
    localStorage.getItem("token")
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    const res = await exec({ content });
    if (res) {
      setContent("");
      onCommentPosted?.(res); // call parent callback if provided
    }
  };

  if (!checkedAuth) return null;

  if (!isAuthenticated) {
    return <LogInCta text="Најави се за да коментираш..." />;
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
