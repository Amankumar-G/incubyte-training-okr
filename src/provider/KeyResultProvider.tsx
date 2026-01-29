import React, { createContext, useState } from "react";
import type { KeyResult } from "../types/okr_types";

type KeyResultContextType = {
    keyResultList: KeyResult[],
    setKeyResultList: React.Dispatch<React.SetStateAction<KeyResult[]>>
}

export const KeyResultContext = createContext<KeyResultContextType>({
    keyResultList: [],
    setKeyResultList: () => { }
});

type KeyResultProviderProps = {
    children: React.ReactNode
}

const KeyResultProvider = ({ children }: KeyResultProviderProps) => {
    const [keyResultList, setKeyResultList] = useState<KeyResult[]>([]);

    return (
        <KeyResultContext.Provider value={{ keyResultList, setKeyResultList }} children={children} />
    )
}

export default KeyResultProvider

