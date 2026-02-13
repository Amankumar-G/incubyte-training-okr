import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CreateKeyResultDto } from './create-key-result.dto';

export class CreateObjectiveDto {
  @ApiProperty({ example: 'Increase customer retention' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ type: [CreateKeyResultDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateKeyResultDto)
  keyResults: CreateKeyResultDto[];
}
