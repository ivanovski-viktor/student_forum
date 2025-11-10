import placeholder from "../../assets/image-placeholder.webp";

export default function Banner({ img_url, text }) {
  return (
    <div className="p-5 border flex items-center justify-center border-stroke rounded-xl shadow-sm relative min-h-52 lg:min-h-76 2xl:min-h-86 overflow-hidden">
      {img_url ? (
        <img
          className="absolute top-0 left-0 w-full h-full object-cover"
          src={img_url}
          alt="Group cover image."
        />
      ) : (
        <img
          src={placeholder}
          className="absolute top-0 left-0 w-full h-full object-cover object-top"
          alt="students graphic"
        />
      )}

      <div className="absolute top-0 left-0 w-full h-full bg-background/30 blur-[100px]"></div>
      <p className="relative font-semibold text-balance text-foreground text-xl lg:text-2xl text-center w-full capitalize">
        {text}
      </p>
    </div>
  );
}
