import LinkUnderline from "../ui/LinkUnderline";

export default function LogInCta() {
  return (
    <div className="flex items-center justify-between py-4  rounded-md text-sm">
      <span>Најави се за да коментираш...</span>
      <LinkUnderline to="/login" text="Кон најава" />
    </div>
  );
}
