export function ProgressBar({ percent }: { percent: number }) {
  return (
    <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
      <div
        className="bg-blue-600 h-full transition-all duration-150"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
