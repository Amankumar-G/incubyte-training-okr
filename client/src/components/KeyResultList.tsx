import { useKeyResult } from '../context/KeyResultContext.tsx';

const KeyResultList = () => {
  const { keyResultList, removeKeyResult } = useKeyResult();

  if (keyResultList.length === 0) {
    return (
      <div className="text-center py-4 px-3 bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <p className="text-xs text-gray-400">No key results added yet.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-baseline mb-1">
        <h3 className="text-xs font-semibold text-gray-700">Added Key Results</h3>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
          {keyResultList.length}
        </span>
      </div>

      <ul className="flex flex-col gap-2">
        {keyResultList.map((kr) => (
          <li
            key={kr.id}
            className="flex items-start gap-2 p-3 bg-gray-50/50 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
          >
            <div className="flex-1 flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <p className="text-gray-800 font-medium text-xs">{kr.description}</p>
                <button
                  type="button"
                  className="text-xs text-red-500 hover:underline"
                  onClick={() => removeKeyResult(kr.id)}
                >
                  &#128465;
                </button>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all"
                    style={{ width: `${kr.progress}%` }}
                  ></div>
                </div>
                <span className="text-xs font-semibold text-blue-600 whitespace-nowrap">
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
