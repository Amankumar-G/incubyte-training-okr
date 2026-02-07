import { type ChangeEvent, useState } from 'react';
import type { keyResultFormType } from '../types/OkrFormTypes.ts';

import { useKeyResult } from '../context/KeyResultContext.tsx';

function KeyResultForm() {
  const [keyResult, setKeyResult] = useState<keyResultFormType>({
    description: '',
    progress: 0,
  });

  const { addKeyResult } = useKeyResult();

  const handleAddKeyResult = () => {
    addKeyResult(keyResult);
    setKeyResult({ description: '', progress: 0 });
  };

  const handleDescriptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setKeyResult({ ...keyResult, description: e.target.value });
  };

  const handleProgressChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, Math.min(100, Number(e.target.value)));
    setKeyResult({ ...keyResult, progress: value });
  };

  return (
    <div className="flex flex-col gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex flex-col gap-2">
        <label htmlFor="description" className="text-xs font-semibold text-gray-700">
          Description
        </label>
        <input
          type="text"
          id="description"
          name="description"
          className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          placeholder="Key Result"
          value={keyResult.description}
          onChange={handleDescriptionChange}
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <label htmlFor="progress" className="text-xs font-semibold text-gray-700">
            Progress in %
          </label>
          <input
            type="number"
            id="progress-number"
            name="progress-number"
            min={0}
            max={100}
            value={keyResult.progress}
            onChange={handleProgressChange}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Progress (0-100)%"
          />
        </div>
        <input
          type="range"
          id="progress"
          name="progress"
          min={0}
          max={100}
          value={keyResult.progress}
          onChange={handleProgressChange}
          className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-600 hover:accent-blue-700"
        />
      </div>

      <button
        className="w-full bg-blue-600 text-white px-3 py-1.5 text-xs rounded-lg font-semibold cursor-pointer hover:bg-blue-700 transition-all duration-300 active:scale-95 shadow-sm flex items-center justify-center gap-1"
        type="button"
        onClick={handleAddKeyResult}
      >
        <span>+</span> Add Key Result
      </button>
    </div>
  );
}

export default KeyResultForm;
