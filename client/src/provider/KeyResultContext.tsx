import{ createContext} from "react";
import type { KeyResultContextType } from "./KeyResultProvider";

export const KeyResultContext = createContext<KeyResultContextType>({
    keyResultList: [],
    validateKeyResultList: () => { }
});