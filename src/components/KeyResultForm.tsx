import React, { useState } from 'react'
import type { KeyResult } from '../types/okr_types';

type KeyResultFormProps = {
    keyResultList: KeyResult[],
    setKeyResultList: React.Dispatch<React.SetStateAction<KeyResult[]>>
}

const KeyResultForm = ({ keyResultList, setKeyResultList }: KeyResultFormProps) => {
    const [keyResult, setKeyResult] = useState<KeyResult>({
        description: '',
        progress: '',
    });

    function addKeyResult() {
        setKeyResultList([...keyResultList, keyResult]);
        setKeyResult({ description: '', progress: '' });
    }

    return (
        <div className="flex space-x-4 mb-4 mt-4 space-around">
            <label htmlFor="keyResults" className="mr-3">
                Key Results
            </label>

            <div className="flex-col m-1.5 space-y-2">
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
            <button
                className=" bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-600 transition-all duration-300 active:scale-95 ease-in-out"
                type="button"
                onClick={() =>addKeyResult()}
            >
                Add key results
            </button>
        </div>
    )
}

export default KeyResultForm
