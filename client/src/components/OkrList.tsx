import { useState } from 'react';
import type { OkrType, keyResult } from '../types/OkrFormTypes.ts';
import Modal from './Modal.tsx';
import KeyResultProgressControl from './KeyResultProgressControl.tsx';

interface OkrListProps {
  okrs: OkrType[];
  onEditOkr: (id: string) => void;
  onDeleteOkr: (id: string) => void;
  onUpdateKeyResult: (okrId: string, updatedKr: keyResult) => void;
}

function OkrList({ okrs, onEditOkr, onDeleteOkr, onUpdateKeyResult }: Readonly<OkrListProps>) {
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const [activeKeyResult, setActiveKeyResult] = useState<keyResult | null>(null);
  const [activeOkrId, setActiveOkrId] = useState<string>('');
  const [okrIdPendingDeletion, setOkrIdPendingDeletion] = useState<string>('');

  if (okrs.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-sm text-gray-400">No OKRs added yet. Create one to get started!</p>
      </div>
    );
  }

  const openProgressModal = (kr: keyResult, okrId: string) => {
    setActiveKeyResult({ ...kr });
    setActiveOkrId(okrId);
    setIsProgressModalOpen(true);
  };

  const closeProgressModal = () => {
    setActiveKeyResult(null);
    setIsProgressModalOpen(false);
  };

  const saveProgress = (progress: number) => {
    if (!activeKeyResult) return;

    onUpdateKeyResult(activeOkrId, {
      ...activeKeyResult,
      progress,
      isCompleted: progress === 100,
    });

    closeProgressModal();
  };

  const openDeleteConfirm = (okrId: string) => {
    setOkrIdPendingDeletion(okrId);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    onDeleteOkr(okrIdPendingDeletion);
    setIsDeleteConfirmOpen(false);
  };

  return (
    <>
      <div className="max-w-4xl mx-auto px-6 py-6 space-y-6">
        {okrs.map((okr, index) => (
          <section key={okr.id} className="border-b border-gray-200 pb-6 last:border-b-0">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-semibold">
                  {index + 1}
                </span>
                <h2 className="text-lg font-bold text-gray-900 break-words">{okr.objective}</h2>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onEditOkr(okr.id)}
                  className="px-3 py-1 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => openDeleteConfirm(okr.id)}
                  className="px-3 py-1 text-xs bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>

            <div className="ml-9 space-y-2">
              {okr.keyResults.map((kr) => (
                <button
                  key={kr.id}
                  onClick={() => openProgressModal(kr, okr.id)}
                  className="w-full text-left p-3 bg-gray-50 border border-gray-200 rounded-lg hover:border-blue-300 transition"
                >
                  <div className="flex justify-between items-center">
                    <p className="text-xs font-medium text-gray-700 truncate">{kr.description}</p>
                    <span className="text-xs font-semibold text-blue-600">{kr.progress}%</span>
                  </div>
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>

      <Modal
        isOpen={isProgressModalOpen}
        onClose={closeProgressModal}
        title={activeKeyResult?.description ?? ''}
        description="Update Key Result Progress"
        size="md"
      >
        {activeKeyResult && (
          <KeyResultProgressControl
            initialValue={activeKeyResult.progress}
            onConfirm={saveProgress}
          />
        )}
      </Modal>

      <Modal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        title="Delete OKR"
        description="This action cannot be undone."
        size="sm"
      >
        <div className="flex justify-around gap-4 m-6">
          <button
            onClick={() => setIsDeleteConfirmOpen(false)}
            className="px-4 py-2 bg-gray-200 rounded-lg"
          >
            Cancel
          </button>
          <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg">
            Delete
          </button>
        </div>
      </Modal>
    </>
  );
}

export default OkrList;
