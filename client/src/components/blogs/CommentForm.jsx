import Input from "../ui/Input";

import { CircleArrowRight } from "lucide-react";

export default function CommentForm({
  loading,
  handleSubmit,
  content,
  setContent,
  error,
  placeholder = "Коментирај...",
}) {
  return (
    <div className="mt-2">
      <form onSubmit={handleSubmit} className="relative ">
        <Input
          className="input input--secondary"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={loading}
          placeholder={placeholder}
        />

        <button className="input-btn input-btn--icon" type="submit">
          <CircleArrowRight size={24} />
        </button>
      </form>
      {error && <p className="text-error text-xs">{error}</p>}
    </div>
  );
}
