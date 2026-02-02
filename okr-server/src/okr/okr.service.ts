import { Injectable } from '@nestjs/common';
import { OkrType } from '../types/okr.types';
import { OkrDtoType } from '../types/okrDto.types';
import okrData from 'src/resource/db.json';

@Injectable()
export class OkrService {
  private readonly okrs: OkrType[] = okrData;

  fetchAll() {
    return this.okrs;
  }

  createOkr(createOkrDto: OkrDtoType) {
    const newOkr: OkrType = { id: crypto.randomUUID(), ...createOkrDto };
    this.okrs.push(newOkr);
    return newOkr;
  }
}
