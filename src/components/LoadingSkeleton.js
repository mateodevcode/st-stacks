export default function LoadingSkeleton({ count = 3 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="bg-segundo border border-tercero/20 rounded-lg p-6 animate-pulse"
        >
          <div className="h-6 bg-segundo rounded w-2/3 mb-4"></div>
          <div className="h-4 bg-segundo rounded w-full mb-2"></div>
          <div className="h-4 bg-segundo rounded w-4/5 mb-4"></div>
          <div className="space-y-2 mb-4">
            <div className="h-3 bg-segundo rounded w-3/4"></div>
            <div className="h-3 bg-segundo rounded w-2/3"></div>
          </div>
          <div className="flex gap-2 pt-4 border-t border-tercero/10">
            <div className="h-10 bg-segundo rounded flex-1"></div>
            <div className="h-10 bg-segundo rounded w-10"></div>
            <div className="h-10 bg-segundo rounded w-10"></div>
          </div>
        </div>
      ))}
    </>
  );
}
