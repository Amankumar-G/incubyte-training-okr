import { Injectable } from '@nestjs/common';

@Injectable()
export class KeyResultsService {
  fetchAll() {
    return [{ id: '1', description: 'Key Result Example' }];
  }
}
