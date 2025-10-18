export default function Message({ type = "success", text }) {
  return (
    <div
      className={`px-3 py-2 my-2 rounded text-sm ${
        type === "error"
          ? "bg-error/10 text-error"
          : "bg-success/10 text-success"
      }`}
    >
      {text}
    </div>
  );
}
