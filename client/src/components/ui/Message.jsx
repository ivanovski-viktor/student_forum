export default function Message({ type, text }) {
  return (
    <div
      className={`px-3 py-2 rounded text-sm ${
        type === "error"
          ? "bg-red-100 text-red-600"
          : "bg-green-100 text-green-600"
      }`}
    >
      {text}
    </div>
  );
}
