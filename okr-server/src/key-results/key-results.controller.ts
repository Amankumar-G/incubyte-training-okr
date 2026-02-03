import { Controller, Get } from '@nestjs/common';
import { KeyResultsService } from './key-results.service';

@Controller('key-results')
export class KeyResultsController {
  constructor(private readonly keyResultsService: KeyResultsService) {}

  @Get()
  fetchAll() {
    return this.keyResultsService.fetchAll();
  }
}
