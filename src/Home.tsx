import OkrForm from './context/OkrForm.tsx';
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
    <div className={'min-h-screen bg-gray-100 flex flex-col'}>
      <div className="flex justify-end">
        <button
          onClick={handleOkrFormOpen}
          className="px-6 py-4 m-5 bg-blue-600 text-white rounded-lg font-semibold cursor-pointer hover:bg-blue-700 transition-all duration-300 active:scale-95 shadow-md"
        >
          Open OKR Form
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
      <OkrList okrs={okrData} />
    </div>
  );
};
export default Home;
