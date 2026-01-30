import { useKeyResult } from '../context/KeyResultContext.tsx';

const KeyResultList = () => {
  const { keyResultList } = useKeyResult();

  if (keyResultList.length === 0) {
    return (
      <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <p className="text-sm text-gray-400">No key results added yet.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-baseline mb-2">
        <h3 className="text-sm font-semibold text-gray-700">Added Key Results</h3>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
          {keyResultList.length}
        </span>
      </div>

      <ul className="flex flex-col gap-3">
        {keyResultList.map((kr, index) => (
          <li
            key={index}
            className="flex items-start gap-3 p-4 bg-gray-50/50 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
          >
            <div className="flex-1 flex flex-col gap-2">
              <p className="text-gray-800 font-medium text-sm">{kr.description}</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all"
                    style={{ width: `${kr.progress}%` }}
                  ></div>
                </div>
                <span className="text-xs font-semibold text-blue-600">{kr.progress}%</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default KeyResultList;
