export function LoadingState() {
  return (
    <div className="flex flex-col space-y-4 animate-pulse">
      <div className="h-4 bg-[#EAE7EC] rounded w-48"></div>
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="flex justify-between items-center py-3 border-b border-[#EAE7EC]"
        >
          <div className="h-5 bg-[#EAE7EC] rounded w-32"></div>
          <div className="flex gap-1.5">
            <div className="h-5 w-5 bg-[#EAE7EC] rounded"></div>
            <div className="h-5 w-5 bg-[#EAE7EC] rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
