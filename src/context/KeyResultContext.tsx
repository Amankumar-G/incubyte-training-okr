import { createContext, useContext } from 'react';
import type { keyResult } from '../types/OkrFormTypes.ts';

type keyResultContextType = {
  keyResultList: keyResult[];
  setKeyResultList: (keyResultList: keyResult[]) => void;
};

export const KeyResultContext = createContext<keyResultContextType>({
  keyResultList: [],
  setKeyResultList: () => {},
});

export const useKeyResult = () => useContext(KeyResultContext);