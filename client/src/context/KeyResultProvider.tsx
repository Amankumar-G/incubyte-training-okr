import { type ReactNode, useCallback, useMemo, useState } from 'react';
import type { keyResult, keyResultFormType } from '../types/OkrFormTypes.ts';
import { KeyResultContext } from './KeyResultContext.tsx';

interface KeyResultProviderProps {
  readonly children: ReactNode;
}

function KeyResultProvider({ children }: KeyResultProviderProps) {
  const [keyResultList, setKeyResultList] = useState<keyResult[]>([]);

  const addKeyResult = useCallback((keyResult: keyResultFormType) => {
    if (!keyResult.description.trim()) return;

    setKeyResultList((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        isCompleted: false,
        ...keyResult,
      },
    ]);
  }, []);

  const clearKeyResults = useCallback(() => {
    setKeyResultList([]);
  }, []);

  const removeKeyResult = useCallback((id: string) => {
    setKeyResultList((prev) => prev.filter((kr) => kr.id !== id));
  }, []);

  const setKeyResults = useCallback((keyResults: keyResult[]) => {
    setKeyResultList(keyResults);
  }, []);

  const value = useMemo(
    () => ({
      keyResultList,
      addKeyResult,
      clearKeyResults,
      removeKeyResult,
      setKeyResults,
    }),
    [keyResultList, addKeyResult, clearKeyResults, removeKeyResult, setKeyResults]
  );

  return <KeyResultContext.Provider value={value}>{children}</KeyResultContext.Provider>;
}

export default KeyResultProvider;
