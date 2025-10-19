export default function Message({ type = "success", text }) {
  return (
    <div
      className={`px-2 py-1.5 my-1 rounded-sm text-sm ${
        type === "error"
          ? "bg-error/10 text-error"
          : "bg-success/10 text-success"
      }`}
    >
      {text}
    </div>
  );
}
