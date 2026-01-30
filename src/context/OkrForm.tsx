import React, { useState } from 'react';
import KeyResultForm from '../components/KeyResultForm.tsx';
import KeyResultList from '../components/KeyResultList.tsx';
import { useKeyResult } from './KeyResultContext.tsx';

function OkrForm() {
  const [objective, setObjective] = useState<string>('');
  const { keyResultList, clearKeyResults } = useKeyResult();

  const handleOnFormSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(objective);
    console.log(keyResultList);
    e.currentTarget.reset();
  };

  return (
    <div className="flex flex-col w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden">
      <form onSubmit={(e) => handleOnFormSubmit(e)} autoComplete="off" className="p-8">
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="flex-1">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-xl font-bold text-gray-900">Objective</h2>
              </div>
              <p className="text-sm text-gray-600 mb-4">What do you want to achieve?</p>
              <input
                type="text"
                id="objectives"
                name="objectives"
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="e.g., Launch the new mobile app by Q3"
                required={true}
              />
            </div>

            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-xl font-bold text-gray-900">Add Key Results</h2>
              </div>
              <p className="text-sm text-gray-600 mb-6">
                Add 3-5 measurable key results that will indicate objective success.
              </p>

              <div className="ml-0">
                <KeyResultForm />
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/3 border-t lg:border-t-0 lg:border-l border-gray-200 pt-8 lg:pt-0 lg:pl-8">
            <div className="sticky top-4">
              <h3 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-4">
                Preview
              </h3>
              <KeyResultList />
            </div>
          </div>
        </div>

        <div className="flex flex-row gap-4 justify-end mt-8 pt-8 border-t border-gray-200">
          <button
            className="px-6 py-2.5 text-gray-700 bg-gray-100 rounded-lg font-semibold cursor-pointer hover:bg-gray-200 transition-all duration-300 active:scale-95"
            type="reset"
            onClick={() => {
              setObjective('');
              clearKeyResults();
            }}
          >
            Cancel
          </button>

          <button
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-semibold cursor-pointer hover:bg-blue-700 transition-all duration-300 active:scale-95 shadow-md"
            type="submit"
          >
            Save Objective
          </button>
        </div>
      </form>
    </div>
  );
}

export default OkrForm;
