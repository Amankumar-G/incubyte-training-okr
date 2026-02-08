import { HttpStatus, NotFoundException } from '@nestjs/common';

export class ObjectiveNotFoundException extends NotFoundException {
  constructor(message?: string) {
    super({
      status: HttpStatus.NOT_FOUND,
      message: message || 'Objective not found',
    });
  }
}
