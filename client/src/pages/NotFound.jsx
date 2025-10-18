import Button from "../components/ui/Button";

export default function NotFound({
  text = "Страната која ја бараш не постои!",
  largeText = "404",
}) {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-4 max-w-full">
      <h1 className="!text-6xl lg:!text-[82px] font-bold mb-4 text-gradient ">
        {largeText}
      </h1>
      <p className="text-base mb-5">{text}</p>
      <Button text="Кон Почетна" link="/" />
    </div>
  );
}
