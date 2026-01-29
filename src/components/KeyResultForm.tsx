import { type ChangeEvent, useState } from 'react';
import type { keyResult } from '../types/OkrFormTypes.ts';

import { useKeyResult } from '../context/KeyResultContext.tsx';

function KeyResultForm() {
  const [keyResult, setKeyResult] = useState<keyResult>({
    description: '',
    progress: 0,
  });

  const { keyResultList, setKeyResultList } = useKeyResult();

  const handleAddKeyResult = () => {
    if (keyResult.description.trim() === '') {
      alert('Please add a description for the key result.');
      return;
    }
    setKeyResultList([...keyResultList, keyResult]);
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
    <div className="flex flex-col justify-between mb-4 mt-4 gap-3">
      <h2 className={'text-xl font-bold'}>Add Key Results </h2>
      <label htmlFor="description" className="mr-3">
        Description
      </label>

      <input
        type="text"
        id="description"
        name="description"
        className="border border-black-300 rounded-lg"
        value={keyResult.description}
        onChange={handleDescriptionChange}
      />
      <label htmlFor="progress" className="mr-3">
        Progress
      </label>

      <input
        type="number"
        id="progress"
        name="progress"
        value={keyResult.progress}
        onChange={handleProgressChange}
        className="border border-black-300 rounded-lg"
      />

      <button
        className=" bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-600 transition-all duration-300 active:scale-95 ease-in-out"
        type="button"
        onClick={handleAddKeyResult}
      >
        Add Key Result
      </button>
    </div>
  );
}

export default KeyResultForm;
