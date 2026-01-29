import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import OkrForm from './OkrForm.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <OkrForm />
  </StrictMode>
);
