import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class ProgressDto {
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsNotEmpty()
  progress: number;
}
