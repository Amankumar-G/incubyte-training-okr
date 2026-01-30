import { type ReactNode, useState } from 'react';
import type { keyResult } from '../types/OkrFormTypes.ts';
import { KeyResultContext } from './KeyResultContext.tsx';

interface KeyResultProviderProps {
  readonly children: ReactNode;
}

function KeyResultProvider({ children }: KeyResultProviderProps) {
  const [keyResultList, setKeyResultList] = useState<keyResult[]>([]);

  const addKeyResult = (keyResult: keyResult) => {
    if (keyResult.description.trim() === '') {
      alert('Please add a description for the key result.');
      return;
    }
    setKeyResultList([...keyResultList, keyResult]);
  };

  const clearKeyResults = () => {
    setKeyResultList([]);
  };

  return (
    <KeyResultContext value={{ keyResultList, addKeyResult, clearKeyResults }}>
      {children}
    </KeyResultContext>
  );
}

export default KeyResultProvider;
