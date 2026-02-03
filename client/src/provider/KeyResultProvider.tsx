import React, {useState } from "react";
import type { KeyResult } from "../types/okr_types";
import { KeyResultContext } from "./KeyResultContext";

export type KeyResultContextType = {
    keyResultList: KeyResult[],
    validateKeyResultList: (keyResult: KeyResult) => void
}

type KeyResultProviderProps = {
    children: React.ReactNode
}

const KeyResultProvider = ({ children }: KeyResultProviderProps) => {
    const [keyResultList, setKeyResultList] = useState<KeyResult[]>([]);
    ;

    const validateKeyResultList = (keyResult: KeyResult) => {
        const isValidProgress = /^\d+%?$/.test(keyResult.progress)
        if (isValidProgress === false) {
            alert("Key Result fields cannot be empty");
        }
        else{
            setKeyResultList([...keyResultList, keyResult]);
        }
    };

    return (
        <KeyResultContext.Provider value={{ keyResultList, validateKeyResultList }} >
            {children}
        </KeyResultContext.Provider>
    )
}

export default KeyResultProvider

