import { ObjectiveDtoType } from '../dto/objectiveDtoType';
import { HttpStatus } from '@nestjs/common';

export class DuplicateObjectiveError extends Error {
  constructor(id: string, data: ObjectiveDtoType) {
    super(
      `Objective with id ${id} already has the same objective value: ${data.objective}`,
    );
  }

  getStatus() {
    return HttpStatus.BAD_REQUEST;
  }
}
