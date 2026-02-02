import { Body, Controller, Get, Post } from '@nestjs/common';
import { OkrService } from './okr.service';
import type { OkrDtoType } from '../types/okrDto.types';
import type { OkrType } from '../types/okr.types';

@Controller('okrs')
export class OkrController {
  constructor(private readonly okrService: OkrService) {}

  @Get()
  fetchAll() {
    return this.okrService.fetchAll();
  }

  @Post()
  createOkr(@Body() createOkrDto: OkrDtoType): OkrType {
    return this.okrService.createOkr(createOkrDto);
  }
}
