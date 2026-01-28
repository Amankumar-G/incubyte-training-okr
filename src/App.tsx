function App() {

  const handleOnFormSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formdata = new FormData(e.currentTarget);
    console.log(formdata.get('objectives'));
    console.log(formdata.get('keyResults'));
    e.currentTarget.reset();
  };

  return (
    <div className="flex flex-col gap-4 p-4 items-center h-screen pt-20 bg-white">
      <form onSubmit={(e) => handleOnFormSubmit(e)} autoComplete="off">
        <div className=" grid grid-flow-col grid-rows-4 gap-10 p-7 bg-white border border-gray-300 rounded-lg mb-4 shadow-lg w-96">
          <h2 className="text-2xl font-bold mx-auto">Add your objectives</h2>

          <div className="flex justify-between ">
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

          <div className="flex justify-between ">
            <label htmlFor="keyResults" className="mr-3">
              Key Results
            </label>
            <input
              type="text"
              id="keyResults"
              name="keyResults"
              className="border border-black-300 rounded-lg"
              required
            />
          </div>

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
        </div>
      </form>
    </div>
  );
}

export default App;
