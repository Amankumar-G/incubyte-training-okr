import { createContext, useContext } from 'react';
import type { keyResult, keyResultFormType } from '../types/OkrFormTypes.ts';

type keyResultContextType = {
  keyResultList: keyResult[];
  addKeyResult: (keyResult: keyResultFormType) => void;
  setKeyResults: (keyResults: keyResult[]) => void;
  clearKeyResults: () => void;
  removeKeyResult: (id: string) => void;
};

export const KeyResultContext = createContext<keyResultContextType>({
  keyResultList: [],
  addKeyResult: () => {},
  setKeyResults: () => {},
  clearKeyResults: () => {},
  removeKeyResult() {},
});

export const useKeyResult = () => useContext(KeyResultContext);
