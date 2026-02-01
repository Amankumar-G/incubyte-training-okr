import { type ReactNode, useState } from 'react';
import type { keyResult, keyResultFormType } from '../types/OkrFormTypes.ts';
import { KeyResultContext } from './KeyResultContext.tsx';

interface KeyResultProviderProps {
  readonly children: ReactNode;
}

function KeyResultProvider({ children }: KeyResultProviderProps) {
  const [keyResultList, setKeyResultList] = useState<keyResult[]>([]);

  const addKeyResult = (keyResult: keyResultFormType) => {
    if (keyResult.description.trim() === '') {
      alert('Please add a description for the key result.');
      return;
    }
    setKeyResultList([
      ...keyResultList,
      {
        id: Date.now().toString(),
        isCompleted: false,
        ...keyResult,
      },
    ]);
  };

  const clearKeyResults = () => {
    setKeyResultList([]);
  };

  const removeKeyResult = (id: string) => {
    setKeyResultList(keyResultList.filter(kr => kr.id !== id));
  }

  return (
    <KeyResultContext value={{ keyResultList, addKeyResult, clearKeyResults,removeKeyResult }}>
      {children}
    </KeyResultContext>
  );
}

export default KeyResultProvider;
