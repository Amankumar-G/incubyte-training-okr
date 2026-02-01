import type { keyResult, OkrType } from '../types/OkrFormTypes.ts';

interface OkrListProps {
  okrs?: OkrType[];
}

function KeyResultList({ keyResults = [] }: Readonly<{ keyResults: keyResult[] }>) {
  return (
    <div className="space-y-2">
      {keyResults.map((kr) => (
        <div key={kr.id} className="flex items-center gap-3 p-3 bg-gray-50/50 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
          <input
            type="checkbox"
            name="keyResult"
            defaultChecked={kr.isCompleted}
            disabled
            className="w-4 h-4 text-blue-600 rounded accent-blue-600 shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-700 font-medium wrap-break-word">{kr.description}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all"
                style={{ width: `${kr.progress}%` }}
              ></div>
            </div>
            <span className="text-xs font-semibold text-blue-600 w-10 text-right">{kr.progress}%</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function OkrList({ okrs = [] }: Readonly<OkrListProps>) {
  if (okrs.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-gray-400">No OKRs added yet. Create one to get started!</p>
      </div>
    );
  }

  return (
    <div className="w-full px-6 py-6 mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Your OKRs</h1>
        <p className="text-gray-600 text-xs mt-0.5">
          {okrs.length} objective{okrs.length === 1 ? '' : 's'} in progress
        </p>
      </div>

      <div className="space-y-6">
        {okrs.map((okr, index) => (
          <div key={okr.id} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-600 font-semibold text-xs">
                    {index + 1}
                  </span>
                  <h2 className="text-lg font-bold text-gray-900 wrap-break-word">
                    {okr.objective}
                  </h2>
                </div>
              </div>
            </div>

            <div className="ml-9">
              <h3 className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wider">
                Key Results
              </h3>
              <KeyResultList keyResults={okr.keyResults} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OkrList;
