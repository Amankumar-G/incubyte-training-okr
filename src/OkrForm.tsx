import React from 'react';
import type { keyResult } from './types/OkrFormTypes.ts';
import KeyResultForm from './components/KeyResultForm.tsx';
import KeyResultList from './components/KeyResultList.tsx';

function OkrForm() {
  const [keyResultList, setKeyResultList] = React.useState<keyResult[]>([]);

  const handleOnFormSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    console.log(formData.get('objectives'));
    console.log(formData.get('keyResults'));
    e.currentTarget.reset();
  };

  return (
    <div className="flex flex-col gap-4 p-4 items-center h-screen pt-5 bg-white">
      {/*Form for adding Objectives with Multiple Key Results*/}
      <div className="flex flex-col p-7 bg-white border border-gray-300 rounded-lg mb-4 shadow-lg w-96">
        <form onSubmit={(e) => handleOnFormSubmit(e)} autoComplete="off">
          <h2 className="text-2xl font-bold mx-auto">Add your objectives</h2>

          {/*Objective Form*/}
          <div className="flex flex-row justify-between mb-4 mt-4">
            <label htmlFor="objectives" className="mr-3">
              Objective
            </label>

            <input
              type="text"
              id="objectives"
              name="objectives"
              className="border border-black-300 rounded-lg"
              required
            />
          </div>

          {/*Key Results Form*/}
          <KeyResultForm setKeyResultList={setKeyResultList} keyResultList={keyResultList} />

          {/*Key Result List Rendering*/}
          <KeyResultList keyResultList={keyResultList} />

          {/*Form Action Button*/}
          <div className="flex flex-row gap-4 justify-between">
            <button
              className=" bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-600 transition-all duration-300 active:scale-95 ease-in-out"
              type="submit"
            >
              Submit
            </button>
            <button
              className=" bg-gray-300 text-black px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-400 transition-all duration-300 active:scale-95 ease-in-out"
              type="reset"
            >
              Clear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default OkrForm;
