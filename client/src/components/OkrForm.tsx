import React, { useEffect, useState } from 'react';
import KeyResultForm from './KeyResultForm.tsx';
import KeyResultList from './KeyResultList.tsx';
import { useKeyResult } from '../context/KeyResultContext.tsx';
import type { OkrType } from '../types/OkrFormTypes.ts';

interface OkrFormProps {
  initialOkr: OkrType | null;
  isEditing: boolean;
  onSubmitSuccess: () => void;
  onRefreshOkrs: () => void;
}

export default function OkrForm({
  initialOkr,
  isEditing,
  onSubmitSuccess,
  onRefreshOkrs,
}: Readonly<OkrFormProps>) {
  const [objective, setObjective] = useState<string>(initialOkr?.objective || '');
  const { keyResultList, clearKeyResults, setKeyResults } = useKeyResult();

  useEffect(() => {
    if (initialOkr?.keyResults) {
      setKeyResults(initialOkr.keyResults);
    }
  }, [initialOkr, setKeyResults]);

  const handleOnFormSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const okrData = {
        objective,
        keyResults: keyResultList,
      };

      if (isEditing && initialOkr) {
        await fetch(`http://localhost:3000/okrs/${initialOkr.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(okrData),
        });
      } else {
        await fetch('http://localhost:3000/okrs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(okrData),
        });
      }

      setObjective('');
      clearKeyResults();
      onRefreshOkrs();
      onSubmitSuccess();
    } catch (error) {
      console.error('Error submitting OKR data:', error);
      alert('There was an error saving your Objective and Key Results. Please try again.');
    }
  };

  return (
    <form
      onSubmit={(e) => handleOnFormSubmit(e)}
      autoComplete="off"
      className="flex flex-col h-full p-6"
    >
      <div className="flex gap-6 flex-1 overflow-hidden">
        <div className="flex-[50%] overflow-y-auto pr-3">
          <div className="mb-6 mx-2">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-sm font-bold text-gray-900">Objective</h2>
            </div>
            <p className="text-xs text-gray-600 mb-3">What do you want to achieve?</p>
            <input
              type="text"
              id="objectives"
              name="objectives"
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all wrap-break-word"
              placeholder="Enter your objective here"
              required={true}
            />
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-sm font-bold text-gray-900">Add Key Results</h2>
            </div>
            <p className="text-xs text-gray-600 mb-4 wrap-break-word">
              Add 3-5 measurable key results that will indicate objective success.
            </p>

            <div className="ml-0">
              <KeyResultForm />
            </div>
          </div>
        </div>

        <div className="flex-[50%] border-l border-gray-200 pl-3 overflow-y-auto">
          <h3 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-3 sticky top-0 bg-white py-1">
            Preview
          </h3>
          <KeyResultList />
        </div>
      </div>

      {/* Footer buttons */}
      <div className="flex flex-row gap-3 justify-end mt-3 pt-3 border-t border-gray-200 shrink-0">
        <button
          className="px-4 py-2 text-xs text-gray-700 bg-gray-100 rounded-lg font-semibold cursor-pointer hover:bg-gray-200 transition-all duration-300 active:scale-95"
          type="reset"
          onClick={() => {
            setObjective('');
            clearKeyResults();
          }}
        >
          Cancel
        </button>

        <button
          className="px-4 py-2 text-xs bg-blue-600 text-white rounded-lg font-semibold cursor-pointer hover:bg-blue-700 transition-all duration-300 active:scale-95 shadow-md"
          type="submit"
        >
          {isEditing ? 'Edit Objective' : 'Save Objective'}
        </button>
      </div>
    </form>
  );
}
