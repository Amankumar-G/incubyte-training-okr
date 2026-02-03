import { useContext, useState } from 'react'
import type { KeyResult } from '../types/okr_types';
import { KeyResultContext } from '../provider/KeyResultContext';

const KeyResultForm = () => {
    const { validateKeyResultList} = useContext(KeyResultContext);
    const [keyResult, setKeyResult] = useState<KeyResult>({
        description: '',
        progress: '',
    });

    function addKeyResult() {
        if(keyResult.description != '' && keyResult.progress != '')
        validateKeyResultList(keyResult);
        setKeyResult({ description: '', progress: '' });
    }

    return (

        <div className="flex space-x-4 mb-4 mt-4 space-around">
            <div className='flex-col'>
            <div>
            <label htmlFor="keyResults" className="mr-3 ms-30">
                Key Results
            </label>

            <div className="flex-col m-1.5 space-y-2 ms-17">
                <input
                    type="text"
                    id="description"
                    name="description"
                    className="border border-black-300 rounded-lg  justify-between"
                    value={keyResult.description}
                    onChange={(e) => setKeyResult({ ...keyResult, description: e.target.value })}

                />

                <input
                    type="text"
                    id="progress"
                    name="progress"
                    className="border border-black-300 rounded-lg"
                    // value={}
                    value={keyResult.progress}
                    onChange={(e) => setKeyResult({ ...keyResult, progress: e.target.value })}

                />
            </div>
            </div>

            <div>
            <button
                className=" bg-blue-500 text-white p-1 rounded-lg cursor-pointer hover:bg-blue-600 transition-all duration-300 active:scale-95 ease-in-out ms-25"
                type="button"
                onClick={() =>addKeyResult()}
            >
                Add key results
            </button>
            </div>
            </div>
        </div>
    )
}

export default KeyResultForm
