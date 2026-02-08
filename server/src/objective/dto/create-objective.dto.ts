import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateKeyResultDto } from './create-key-result.dto';

export class CreateObjectiveDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateKeyResultDto)
  keyResults: CreateKeyResultDto[];
}
