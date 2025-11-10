import { usePageLoading } from "../../context/PageLoadingContext";
import LinkUnderline from "../ui/LinkUnderline";

export default function LogInCta({ text = "Најави се..." }) {
  const { setPageLoading } = usePageLoading();

  return (
    <div className="flex items-center justify-between my-4 gap-2 rounded-md text-sm">
      <h3>{text}</h3>
      <LinkUnderline
        onClick={() => setPageLoading(true)}
        to="/login"
        text="Кон најава"
      />
    </div>
  );
}
