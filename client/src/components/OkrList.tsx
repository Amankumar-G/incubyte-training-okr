import { useState } from 'react';
import type { OkrType, keyResult } from '../types/OkrFormTypes.ts';
import Modal from './Modal.tsx';
import KeyResultProgressControl from './KeyResultProgressControl.tsx';
import { Check, Trash2 } from 'lucide-react';

interface OkrListProps {
  okrs: OkrType[];
  onEditOkr: (id: string) => void;
  onDeleteOkr: (id: string) => void;
  onUpdateKeyResultProgress: (keyResultId: string, updatedKr: Partial<keyResult>) => void;
  toggleComplete: (id: string) => void;
  deleteKeyResult: (id: string) => void;
}

function OkrList({
  okrs,
  onEditOkr,
  onDeleteOkr,
  onUpdateKeyResultProgress,
  toggleComplete,
  deleteKeyResult,
}: Readonly<OkrListProps>) {
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const [activeKeyResult, setActiveKeyResult] = useState<keyResult | null>(null);
  const [okrIdPendingDeletion, setOkrIdPendingDeletion] = useState<string>('');

  if (okrs.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-sm text-gray-400">No OKRs added yet. Create one to get started!</p>
      </div>
    );
  }

  const openProgressModal = (kr: keyResult) => {
    setActiveKeyResult({ ...kr });
    setIsProgressModalOpen(true);
  };

  const closeProgressModal = () => {
    setActiveKeyResult(null);
    setIsProgressModalOpen(false);
  };

  const saveProgress = (progress: number) => {
    if (!activeKeyResult) return;

    onUpdateKeyResultProgress(activeKeyResult.id, {
      progress,
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
              <div className="ml-11 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-semibold">
                  {index + 1}
                </span>
                <h2 className="text-lg font-bold text-gray-900">{okr.title}</h2>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onEditOkr(okr.id)}
                  className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={() => openDeleteConfirm(okr.id)}
                  className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg font-medium hover:bg-red-700 transition-colors cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>

            <div className="ml-11 space-y-3">
              <div className="space-y-2">
                {okr.keyResults.map((kr) => {
                  const isCompleted = kr.progress === 100;
                  return (
                    <div
                      key={kr.id}
                      className="group flex items-center rounded-lg px-4 py-3 border border-gray-200 hover:border-blue-300 bg-gray-50 transition-colors"
                    >
                      {/* Complete toggle */}
                      <button
                        type="button"
                        onClick={() => toggleComplete(kr.id)}
                        aria-label="Toggle complete"
                        className="mr-3 flex items-center justify-center w-6 h-6 rounded-full border border-gray-300 text-green-600 hover:bg-green-50 focus:ring-2 focus:ring-green-500 transition-colors cursor-pointer"
                      >
                        {isCompleted && <Check size={14} />}
                      </button>

                      {/* Main content */}
                      <button
                        type="button"
                        onClick={() => openProgressModal(kr)}
                        className="flex-1 flex items-center justify-between text-left focus:outline-none cursor-pointer"
                      >
                        <span className={`text-sm font-medium ${isCompleted ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                          {kr.description}
                        </span>

                        <span className={`ml-3 text-xs font-semibold px-2 py-1 rounded-full ${isCompleted ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-600'}`}>
                          {kr.progress}%
                        </span>
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => deleteKeyResult(kr.id)}
                        aria-label="Delete key result"
                        className="ml-3 p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>
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
        <div className="flex justify-end gap-3 p-6">
          <button
            onClick={() => setIsDeleteConfirmOpen(false)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button 
            onClick={confirmDelete} 
            className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors cursor-pointer"
          >
            Delete
          </button>
        </div>
      </Modal>
    </>
  );
}

export default OkrList;
