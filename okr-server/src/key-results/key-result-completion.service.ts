import { type KeyResultDtoType } from './dto/key-result-dto.type';

export class KeyResultCompletionService {
  isCompleted(keyResultDto: KeyResultDtoType): boolean {
    return keyResultDto.progress === 100;
  }
}
