export default function InlineLoader({ small = false }) {
  let circleSize = "w-12 h-12 border-4";
  let innerCircleSize = "w-8 h-8 border-4";

  if (small) {
    circleSize = "w-4 h-4 border-2";
    innerCircleSize = "w-2.5 h-2.5 border";
  }

  return (
    <div className="flex items-center justify-center h-20">
      <div
        className={`${circleSize} border-transparent text-primary text-4xl animate-spin flex items-center justify-center border-t-primary rounded-full`}
      >
        <div
          className={`${innerCircleSize} border-transparent text-secondary text-2xl animate-spin flex items-center justify-center border-t-secondary-light rounded-full`}
        ></div>
      </div>
    </div>
  );
}
