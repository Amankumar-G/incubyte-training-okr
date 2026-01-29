import { type ReactNode, useState } from 'react';
import type { keyResult } from '../types/OkrFormTypes.ts';
import { KeyResultContext } from './KeyResultContext.tsx';

function KeyResultProvider({ children }: { children: ReactNode }) {
  const [keyResultList, setKeyResultList] = useState<keyResult[]>([]);

  return (
    <KeyResultContext value={{ keyResultList, setKeyResultList }}>{children}</KeyResultContext>
  );
}

export default KeyResultProvider;
