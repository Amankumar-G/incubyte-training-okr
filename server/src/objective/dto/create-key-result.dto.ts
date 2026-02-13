import { IsNumber, IsString, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateKeyResultDto {
  @ApiProperty({ example: 'Reduce churn by 10%' })
  @IsString()
  description: string;

  @ApiProperty({ example: 25, minimum: 0, maximum: 100 })
  @IsNumber()
  @Min(0)
  @Max(100)
  progress: number;
}
