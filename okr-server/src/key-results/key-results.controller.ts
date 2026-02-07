import {
  Body,
  Controller,
  Get,
  Param,
  ValidationPipe,
  Put,
} from '@nestjs/common';
import { KeyResultsService } from './key-results.service';
import { KeyResultDtoType } from './dto/key-result-dto.type';

@Controller('/objectives/:objectiveId/key-results')
export class KeyResultsController {
  constructor(private readonly keyResultsService: KeyResultsService) {}

  @Get()
  fetchAll() {
    return this.keyResultsService.fetchAll();
  }

  @Get()
  fetchByObjectiveId(@Param('objectiveId') objectiveId: string) {
    return this.keyResultsService.getByObjectiveId(objectiveId);
  }

  @Get(':keyResultId')
  fetchOne(@Param('keyResultId') keyResultId: string) {
    return this.keyResultsService.getById(keyResultId);
  }

  @Put(':keyResultId')
  update(
    @Param('keyResultId') keyResultId: string,
    @Body(new ValidationPipe()) keyResultDto: KeyResultDtoType,
  ) {
    return this.keyResultsService.update(keyResultId, keyResultDto);
  }
  //
  // @Post()
  // create(
  //   @Body(new ValidationPipe()) keyResulDto: KeyResultDtoType,
  //   @Param('keyResultId') keyResultId: string,
  // ) {
  //   return this.keyResultsService.create(keyResultId, keyResulDto);
  // }
}
