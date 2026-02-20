import { useState, useEffect } from 'react';

interface KeyResultProgressControlProps {
  initialValue: number;
  onConfirm: (value: number) => void;
}

export default function KeyResultProgressControl({
  initialValue,
  onConfirm,
}: Readonly<KeyResultProgressControlProps>) {
  const [progress, setProgress] = useState(initialValue);

  useEffect(() => {
    setProgress(initialValue);
  }, [initialValue]);

  const isCompleted = progress === 100;

  return (
    <div className="w-full max-w-xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm font-medium text-gray-700 uppercase tracking-wide">
          Completion
        </span>
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold
              ${isCompleted ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-600'}`}
        >
          {isCompleted ? 'Completed' : 'In Progress'}
        </span>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <input
          type="range"
          min={0}
          max={100}
          value={progress}
          onChange={(e) => setProgress(Number(e.target.value))}
          className="flex-1 h-2 accent-blue-600 cursor-pointer"
        />

        <div className="relative">
          <input
            type="number"
            min={0}
            max={100}
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
            className="w-20 px-3 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="absolute right-3 top-2.5 text-xs text-gray-500">%</span>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => onConfirm(progress)}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
        >
          Save Progress
        </button>
      </div>
    </div>
  );
}
