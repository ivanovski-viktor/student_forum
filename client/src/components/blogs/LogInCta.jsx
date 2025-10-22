import LinkUnderline from "../ui/LinkUnderline";

export default function LogInCta({ text = "Најави се..." }) {
  return (
    <div className="flex items-center justify-between py-4  rounded-md text-sm">
      <span>{text}</span>
      <LinkUnderline to="/login" text="Кон најава" />
    </div>
  );
}
