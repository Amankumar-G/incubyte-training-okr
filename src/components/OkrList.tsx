import type { keyResult, OkrType } from '../types/OkrFormTypes.ts';

interface OkrListProps {
  okrs?: OkrType[];
}

function KeyResultList({ keyResults = [] }: Readonly<{ keyResults: keyResult[] }>) {
  return (
    <div>
      {keyResults.map((kr) => (
        <div key={kr.id} className={'mt-5 flex items-center gap-3'}>
          <input type="checkbox" name="keyResult" defaultChecked={kr.isCompleted} disabled />
          <p>{kr.description}</p>
          <span className="text-xs font-semibold text-blue-600">{kr.progress}%</span>
        </div>
      ))}
    </div>
  );
}

function OkrList({ okrs = [] }: Readonly<OkrListProps>) {
  if (okrs.length === 0) {
    return (
      <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <p className="text-sm text-gray-400">No OKRs added yet.</p>
      </div>
    );
  }
  return (
    <div className={'p-10 bg-white max-w-3xl mx-auto mt-10 rounded-lg shadow-lg border'}>
      {okrs.map((okr) => (
        <div key={okr.id} className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{okr.objective}</h2>
          <KeyResultList keyResults={okr.keyResults} />
        </div>
      ))}
    </div>
  );
}

export default OkrList;
