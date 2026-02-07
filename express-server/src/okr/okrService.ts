import {OkrType} from "../types/okr.types";
import okrData from '../resource/db.json';
import {v4 as uuid4} from 'uuid';
export class OkrService {


    getAll() : OkrType[] {
        return  okrData;
    }

    create(okr: Omit<OkrType, "id">): OkrType {
        let id = uuid4()
        let okrWithId: OkrType = {...okr, id};
        okrData.push(okrWithId);
        return okrWithId;
    }

    delete(id: string) {
        const index = okrData.findIndex(okr => okr.id === id);
        if (index !== -1) {
            okrData.splice(index, 1);
            return true;
        }
        return false;
    }

    edit(id: string, okr: OkrType) : OkrType | null {
        const index = okrData.findIndex(existingOkr => existingOkr.id === id);
        if (index !== -1) {
            okrData[index] = {...okr, id};
            return okrData[index];
        }
        return null;
    }
}