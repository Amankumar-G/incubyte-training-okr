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
    <div className="w-full max-w-xl mx-auto p-4">
        <div className="flex items-center justify-between m-4">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Completion
          </span>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-semibold
              ${isCompleted ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}
          >
            {isCompleted ? 'Completed' : 'In Progress'}
          </span>
        </div>


        <div className="flex items-center gap-3">
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
              className="w-16 pl-2 pr-5 py-1 text-sm font-medium text-gray-700 border border-gray-300 rounded-md text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="absolute right-2 top-1.5 text-xs text-gray-400">%</span>
          </div>
        </div>

      <div className="flex justify-end pt-6">
        <button
          onClick={() => onConfirm(progress)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-semibold
                     hover:bg-blue-700 active:scale-95 transition-all shadow-sm hover:shadow-md"
        >
          Save Progress
        </button>
      </div>
    </div>
  );
}
