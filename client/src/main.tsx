import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
<<<<<<< HEAD:client/src/main.tsx
import App from './Home.tsx';
=======
import OkrForm from './OkrForm.tsx';
>>>>>>> origin/main:src/main.tsx

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <OkrForm />
  </StrictMode>
);
