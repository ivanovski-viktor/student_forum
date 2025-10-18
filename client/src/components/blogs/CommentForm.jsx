import { PiArrowFatLinesRightFill } from "react-icons/pi";
import Input from "../ui/Input";

export default function CommentForm({
  loading,
  handleSubmit,
  content,
  setContent,
  error,
  placeholder = "Коментирај...",
}) {
  return (
    <div>
      <form onSubmit={handleSubmit} className="relative mt-2">
        <Input
          className="input input--secondary"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={loading}
          placeholder={placeholder}
        />

        <button className="input-btn input-btn--secondary" type="submit">
          <PiArrowFatLinesRightFill />
        </button>
      </form>
      {error && <p className="text-error text-xs">{error}</p>}
    </div>
  );
}
