export function LoadingState() {
  return (
    <div className="flex flex-col gap-4 animate-pulse">
      <div className="h-4 bg-[#EAE7EC] mb-2 rounded w-48"></div>
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className="flex justify-between items-center pb-4 border-b last:border-b-0 border-[#EAE7EC]"
        >
          <div
            className={`h-5 bg-[#EAE7EC] rounded ${i % 2 === 0 ? "w-32" : "w-40"}`}
          ></div>
          <div className="flex gap-1.5">
            <div className="h-6 w-8 bg-[#EAE7EC] rounded"></div>
            <div className="h-6 w-6 bg-[#EAE7EC] rounded"></div>
            <div className="h-6 w-6 bg-[#EAE7EC] rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
