import OkrForm from './components/OkrForm.tsx';
import KeyResultProvider from './context/KeyResultProvider.tsx';
import Modal from './components/Modal.tsx';
import { useEffect, useState } from 'react';
import OkrList from './components/OkrList.tsx';
import type { OkrType } from './types/OkrFormTypes.ts';

const Home = () => {
  const [isOpenOkrForm, setIsOpenOkrForm] = useState(false);
  const [okrData, setOkrData] = useState<OkrType[]>([]);

  useEffect(() => {
    fetch('http://localhost:3000/okrs/')
      .then((response) => response.json())
      .then((data) => {
        setOkrData(data);
      });
  });

  const handleOkrFormClose = () => {
    setIsOpenOkrForm(false);
  };

  const handleOkrFormOpen = () => {
    setIsOpenOkrForm(true);
  };

  return (
    <div className={'min-h-screen bg-linear-to-b from-gray-50 to-gray-100 flex flex-col '}>

      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-4 flex justify-between items-center max-w-5xl mx-auto">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">OKR Management</h1>
            <p className="text-gray-600 text-xs mt-0.5">Track and achieve your objectives</p>
          </div>
          <button
            onClick={handleOkrFormOpen}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg font-semibold cursor-pointer hover:bg-blue-700 transition-all duration-300 active:scale-95 shadow-md hover:shadow-lg"
          >
            + New OKR
          </button>
          <Modal
            isOpen={isOpenOkrForm}
            onClose={handleOkrFormClose}
            title="Create New OKR"
            description="Define your objective and key results"
          >
            <KeyResultProvider>
              <OkrForm />
            </KeyResultProvider>
          </Modal>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        <OkrList okrs={okrData} />
      </div>
    </div>
  );
};
export default Home;
