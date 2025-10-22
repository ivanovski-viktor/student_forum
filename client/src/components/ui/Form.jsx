export default function Form({ title, children, handleSubmit }) {
  return (
    <div className="w-md max-w-full m-auto p-6 sm:p-10 border shadow-2xl shadow-gray-200 border-stroke bg-background rounded-xl">
      <h2 className="text-2xl mb-10 text-center">{title}</h2>
      <form
        method="POST"
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
      >
        {children}
      </form>
    </div>
  );
}
