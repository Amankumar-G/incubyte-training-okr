import { useEffect, useState } from 'react';
import type { keyResult, OkrType } from './types/OkrFormTypes.ts';
import Modal from './components/Modal.tsx';
import OkrForm from './components/OkrForm.tsx';
import OkrList from './components/OkrList.tsx';
import KeyResultProvider from './context/KeyResultProvider.tsx';
import objectiveService from './api/services/objectiveService.ts';
import keyResultService from './api/services/keyResultService.ts';

const Home = () => {
  const [okrs, setOkrs] = useState<OkrType[]>([]);
  const [activeOkrForEdit, setActiveOkrForEdit] = useState<OkrType | null>(null);

  const [isOkrFormModalOpen, setIsOkrFormModalOpen] = useState(false);

  const fetchAllOkrs = async () => {
    const response = await objectiveService.getAllOkrs();
    return response.data;
  };

  useEffect(() => {
    fetchAllOkrs().then((data: OkrType[]) => setOkrs(data));
  }, []);

  const openCreateOkrModal = () => {
    setActiveOkrForEdit(null);
    setIsOkrFormModalOpen(true);
  };

  const openEditOkrModal = (okrId: string) => {
    const okr = okrs.find((o) => o.id === okrId);
    if (okr) {
      setActiveOkrForEdit(okr);
      setIsOkrFormModalOpen(true);
    }
  };

  const closeOkrFormModal = () => {
    setIsOkrFormModalOpen(false);
    setActiveOkrForEdit(null);
  };

  const deleteOkr = async (okrId: string) => {
    await objectiveService.deleteOkr(okrId);

    fetchAllOkrs().then((data: OkrType[]) => setOkrs(data));
  };

  const updateKeyResultProgress = async (keyResultId: string, toUpdatedKr: Partial<keyResult>) => {
    await keyResultService.updateKeyResult(keyResultId, toUpdatedKr);
    fetchAllOkrs().then((data: OkrType[]) => setOkrs(data));
  };

  const toggleComplete = async (id: string) => {
    await keyResultService.toggleComplete(id);
    fetchAllOkrs().then((data: OkrType[]) => setOkrs(data));
  };

  const deleteKeyResult = async (id: string) => {
    await keyResultService.deleteKeyResult(id);
    fetchAllOkrs().then((data: OkrType[]) => setOkrs(data));
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100 flex flex-col">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-4 max-w-5xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Objective & Key Results Tracker</h1>
            <p className="text-xs text-gray-600 mt-0.5">Track and achieve your objectives</p>
          </div>

          <button
            onClick={openCreateOkrModal}
            className="px-4 py-2 text-sm text-black border border-solid border-blue-500  hover:bg-blue-300 rounded-lg font-semibold transition-all shadow-md hover:cursor-pointer"
          >
            + Add OKR
          </button>
        </div>
      </header>

      <main className="flex-1">
        <OkrList
          okrs={okrs}
          onEditOkr={openEditOkrModal}
          onDeleteOkr={deleteOkr}
          onUpdateKeyResultProgress={updateKeyResultProgress}
          deleteKeyResult={deleteKeyResult}
          toggleComplete={toggleComplete}
        />
      </main>

      <Modal
        isOpen={isOkrFormModalOpen}
        onClose={closeOkrFormModal}
        title={activeOkrForEdit ? 'Edit OKR' : 'Create New OKR'}
        description="Define your objective and key results"
        size="lg"
      >
        <KeyResultProvider>
          <OkrForm
            initialOkr={activeOkrForEdit}
            isEditing={Boolean(activeOkrForEdit)}
            onSubmitSuccess={closeOkrFormModal}
            onRefreshOkrs={() => {
              fetchAllOkrs().then((data: OkrType[]) => setOkrs(data));
            }}
          />
        </KeyResultProvider>
      </Modal>
    </div>
  );
};

export default Home;
