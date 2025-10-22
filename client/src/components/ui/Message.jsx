export default function Message({ simple = false, type = "success", text }) {
  if (simple) {
    return (
      <span className={type === "error" ? "text-error" : "text-success"}>
        {text}
      </span>
    );
  }

  return (
    <div
      className={`px-2 py-1.5 my-1 rounded-md text-sm ${
        type === "error"
          ? "bg-error/10 text-error"
          : "bg-success/10 text-success"
      }`}
    >
      {text}
    </div>
  );
}
