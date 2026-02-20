import React, { useEffect, useState } from 'react';
import KeyResultForm from './KeyResultForm.tsx';
import KeyResultList from './KeyResultList.tsx';
import { useKeyResult } from '../context/KeyResultContext.tsx';
import type { OkrType } from '../types/OkrFormTypes.ts';
import objectiveService from '../api/services/objectiveService.ts';

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
  const [title, setTitle] = useState<string>(initialOkr?.title || '');
  const { keyResultList, clearKeyResults, setKeyResults } = useKeyResult();

  useEffect(() => {
    if (initialOkr) {
      setTitle(initialOkr.title);
      setKeyResults(initialOkr.keyResults);
    } else {
      // If switching to create mode (null), reset
      setTitle('');
      clearKeyResults();
    }
  }, [initialOkr, setKeyResults, clearKeyResults]);

  const handleOnFormSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const okrData = {
        title,
        keyResults: keyResultList.map((kr) => ({
          description: kr.description,
          progress: kr.progress,
        })),
      };

      if (isEditing && initialOkr) {
        await objectiveService.updateOkr(initialOkr.id, okrData);
      } else {
        await objectiveService.createOkr(okrData);
      }

      setTitle('');
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
        <div className="flex-[50%] overflow-y-auto pr-4">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-sm font-bold text-gray-900">Objective</h2>
            </div>
            <p className="text-sm text-gray-600 mb-3">What do you want to achieve?</p>
            <input
              type="text"
              id="objectives"
              name="objectives"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter your objective here"
              required={true}
            />
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-sm font-bold text-gray-900">Add Key Results</h2>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Add 3-5 measurable key results that will indicate objective success.
            </p>

            <div className="ml-0">
              <KeyResultForm />
            </div>
          </div>
        </div>

        <div className="flex-[50%] border-l border-gray-200 pl-4 overflow-y-auto">
          <h3 className="text-xs font-bold uppercase text-gray-500 tracking-wider mb-4 sticky top-0 bg-white py-2">
            Preview
          </h3>
          <KeyResultList />
        </div>
      </div>

      {/* Footer buttons */}
      <div className="flex flex-row gap-3 justify-end mt-4 pt-4 border-t border-gray-200 shrink-0">
        <button
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors cursor-pointer"
          type="reset"
          onClick={() => {
            setTitle('');
            clearKeyResults();
          }}
        >
          Cancel
        </button>

        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
          type="submit"
        >
          {isEditing ? 'Update Objective' : 'Save Objective'}
        </button>
      </div>
    </form>
  );
}
