import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import OkrForm from './OkrForm.tsx';
import KeyResultProvider from './context/KeyResultProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <KeyResultProvider>
      <OkrForm />
    </KeyResultProvider>
  </StrictMode>
);
