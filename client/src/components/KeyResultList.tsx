import { useKeyResult } from '../context/KeyResultContext.tsx';

const KeyResultList = () => {
  const { keyResultList, removeKeyResult } = useKeyResult();

  if (keyResultList.length === 0) {
    return (
      <div className="text-center py-6 px-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <p className="text-sm text-gray-500">No key results added yet.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-baseline mb-2">
        <h3 className="text-sm font-medium text-gray-700">Added Key Results</h3>
        <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full font-medium">
          {keyResultList.length}
        </span>
      </div>

      <ul className="flex flex-col gap-2">
        {keyResultList.map((kr) => (
          <li
            key={kr.id}
            className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
          >
            <div className="flex-1 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <p className="text-gray-900 font-medium text-sm">{kr.description}</p>
                <button
                  type="button"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg p-1.5 transition-colors"
                  onClick={() => removeKeyResult(kr.id)}
                  aria-label="Remove key result"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 transition-all rounded-full"
                    style={{ width: `${kr.progress}%` }}
                  ></div>
                </div>
                <span className="text-sm font-semibold text-blue-600 whitespace-nowrap min-w-[45px] text-right">
                  {kr.progress}%
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default KeyResultList;
