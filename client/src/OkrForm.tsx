import { useState } from 'react';
import KeyResultList from './components/KeyResultList.tsx';
import KeyResultForm from './components/KeyResultForm.tsx';
import KeyResultProvider from './provider/KeyResultProvider.tsx';

export function OkrForm() {
  const [objective, setObjective] = useState<string>('');

  const handleOnFormSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <KeyResultProvider>
      <div className="flex flex-col gap-9 p-4 items-center h-screen pt-20 bg-white">
        <form onSubmit={(e) => handleOnFormSubmit(e)} autoComplete="off">
          <div className="  p-7 bg-white border border-gray-300 rounded-lg mb-4 shadow-lg w-96">
            <h2 className="text-2xl font-bold mx-auto ms-25">OKR form</h2>

            <div className="flex justify-between flex-col">
              <label htmlFor="objectives" className="mr-3 ms-30">
                Objective
              </label>

              <input
                type="text"
                id="objectives"
                name="objectives"
                className="border border-black-300 rounded-lg"
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                required
              />
            </div>

            <KeyResultForm />

            <div className="flex flex-row gap-4 justify-between mt-4">
              <button
                className=" bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-600 transition-all duration-300 active:scale-95 ease-in-out"
                type="submit"
              >
                Submit
              </button>
              <button
                type="reset"
                className=" bg-gray-300 text-black px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-400 transition-all duration-300 active:scale-95 ease-in-out"
              >
                Clear
              </button>
            </div>
            <KeyResultList />
          </div>
        </form>
      </div>
    </KeyResultProvider>
  );
}

export default OkrForm;
