import React, { useState } from 'react';
import KeyResultForm from './components/KeyResultForm.tsx';
import KeyResultList from './components/KeyResultList.tsx';
import { useKeyResult } from './context/KeyResultContext.tsx';

function OkrForm() {
  const [objective, setObjective] = useState<string>('');
  const { keyResultList } = useKeyResult();

  const handleOnFormSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(objective);
    console.log(keyResultList);
    e.currentTarget.reset();
  };

  return (
    <div className="flex flex-col gap-4 p-4 items-center h-screen pt-5 bg-white">
      {/*Form for adding Objectives with Multiple Key Results*/}
      <div className="flex flex-col p-7 bg-white border border-gray-300 rounded-lg mb-4 shadow-lg w-96">
        <form onSubmit={(e) => handleOnFormSubmit(e)} autoComplete="off">
          <h1 className="text-2xl font-bold text-center">OKR Form</h1>

          {/*Objective Form*/}
          <div className="flex flex-col justify-between mb-4 mt-4">
            <h2 className={'text-xl font-bold'}>Add objective</h2>

            <div className={'flex flex-col'}>
              <label htmlFor="objectives" className="mr-3">
                Objective
              </label>

              <input
                type="text"
                id="objectives"
                name="objectives"
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                className="border border-black-300 rounded-lg"
                required={true}
              />
            </div>
          </div>

          <button
            className=" bg-gray-300 text-black px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-400 transition-all duration-300 active:scale-95 ease-in-out"
            type="reset"
            onClick={() => setObjective('')}
          >
            Clear
          </button>

          {/*Key Results Form*/}
          <KeyResultForm />

          {/*Key Result List Rendering*/}
          <KeyResultList />

          {/*Form Action Button*/}
          <div className="flex flex-row gap-4 justify-between">
            <button
              className=" bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-600 transition-all duration-300 active:scale-95 ease-in-out"
              type="submit"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default OkrForm;
