import { createContext, useContext } from 'react';
import type { keyResult } from '../types/OkrFormTypes.ts';

type keyResultContextType = {
  keyResultList: keyResult[];
  addKeyResult: (keyResult: keyResult) => void;
  clearKeyResults: () => void;
};

export const KeyResultContext = createContext<keyResultContextType>({
  keyResultList: [],
  addKeyResult: () => {},
  clearKeyResults: () => {},
});

export const useKeyResult = () => useContext(KeyResultContext);
