import { useEffect, useState } from 'react';
import type { keyResult, OkrType } from './types/OkrFormTypes.ts';
import Modal from './components/Modal.tsx';
import OkrForm from './components/OkrForm.tsx';
import OkrList from './components/OkrList.tsx';
import KeyResultProvider from './context/KeyResultProvider.tsx';
import AiOkrGeneratorModal from './components/AiOkrGeneratorModal.tsx';
import ChatbotPopup from './components/ChatbotPopup.tsx';
import objectiveService from './api/services/objectiveService.ts';
import keyResultService from './api/services/keyResultService.ts';

const Home = () => {
  const [okrs, setOkrs] = useState<OkrType[]>([]);
  const [activeOkrForEdit, setActiveOkrForEdit] = useState<OkrType | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [isOkrFormModalOpen, setIsOkrFormModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const fetchAllOkrs = async () => {
    const response = await objectiveService.getAllOkrs();
    return response.data;
  };

  useEffect(() => {
    fetchAllOkrs().then((data: OkrType[]) => setOkrs(data));
  }, []);

  const openCreateOkrModal = () => {
    setActiveOkrForEdit(null);
    setIsEditing(false);
    setIsOkrFormModalOpen(true);
  };

  const openEditOkrModal = (okrId: string) => {
    const okr = okrs.find((o) => o.id === okrId);
    if (okr) {
      setActiveOkrForEdit(okr);
      setIsEditing(true);
      setIsOkrFormModalOpen(true);
    }
  };

  const openAiOkrModal = () => {
    setIsAiModalOpen(true);
  };

  const openChatbot = () => {
    setIsChatbotOpen(true);
  };

  const handleAiOkrApply = (draftOkr: Omit<OkrType, 'id'>) => {
    const okrWithTempId: OkrType = {
      ...draftOkr,
      id: 'temp-ai-draft',
    };

    setActiveOkrForEdit(okrWithTempId);
    setIsEditing(false); // Treat as new creation
    setIsAiModalOpen(false);
    setIsOkrFormModalOpen(true);
  };

  const handleChatbotOkrCreate = (draftOkr: Omit<OkrType, 'id'>) => {
    const okrWithTempId: OkrType = {
      ...draftOkr,
      id: 'temp-chatbot-draft',
    };

    setActiveOkrForEdit(okrWithTempId);
    setIsEditing(false); // Treat as new creation
    setIsChatbotOpen(false);
    setIsOkrFormModalOpen(true);
  };

  const closeOkrFormModal = () => {
    setIsOkrFormModalOpen(false);
    setActiveOkrForEdit(null);
    setIsEditing(false);
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

          <div className="flex gap-2">
            <button
              onClick={openCreateOkrModal}
              className="px-4 py-2 text-sm text-black border border-solid border-blue-500  hover:bg-blue-300 rounded-lg font-semibold transition-all shadow-md hover:cursor-pointer"
            >
              + New OKR
            </button>
            <button
              onClick={openAiOkrModal}
              className="px-4 py-2 text-sm text-black border border-solid border-blue-500  hover:bg-blue-300 rounded-lg font-semibold transition-all shadow-md hover:cursor-pointer"
            >
              + Generate OKR with AI
            </button>
          </div>
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

      {/* Floating Chatbot Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={openChatbot}
          aria-label="Open OKR Chatbot"
          className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-xl flex items-center justify-center"
        >
          💬
        </button>
      </div>

      <Modal
        isOpen={isOkrFormModalOpen}
        onClose={closeOkrFormModal}
        title={activeOkrForEdit && isEditing ? 'Edit OKR' : 'Create New OKR'}
        description="Define your objective and key results"
        size="lg"
      >
        <KeyResultProvider>
          <OkrForm
            initialOkr={activeOkrForEdit}
            isEditing={isEditing}
            onSubmitSuccess={closeOkrFormModal}
            onRefreshOkrs={() => {
              fetchAllOkrs().then((data: OkrType[]) => setOkrs(data));
            }}
          />
        </KeyResultProvider>
      </Modal>

      <AiOkrGeneratorModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onApply={handleAiOkrApply}
      />

      <ChatbotPopup
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
        onCreateOkr={handleChatbotOkrCreate}
      />
    </div>
  );
};

export default Home;
