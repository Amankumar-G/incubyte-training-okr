import React, { useState } from 'react';
import KeyResultForm from './KeyResultForm.tsx';
import KeyResultList from './KeyResultList.tsx';
import { useKeyResult } from '../context/KeyResultContext.tsx';

function OkrForm() {
  const [objective, setObjective] = useState<string>('');
  const { keyResultList, clearKeyResults } = useKeyResult();

  const handleOnFormSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    try{
      const okrData = {
        objective,
        keyResults: keyResultList,
      };

      await fetch('http://localhost:3000/okrs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(okrData),
      });

      setObjective('');
      clearKeyResults();

    }catch(error){
      console.error('Error submitting OKR data:',error);
      alert('There was an error saving your Objective and Key Results. Please try again.');
    }

    e.currentTarget.reset();
  };

  return (
    <form onSubmit={(e) => handleOnFormSubmit(e)} autoComplete="off" className="flex flex-col h-full p-6">
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
              placeholder="e.g., Launch the new mobile app by Q3"
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
          Save Objective
        </button>
      </div>
    </form>
  );
}

export default OkrForm;
