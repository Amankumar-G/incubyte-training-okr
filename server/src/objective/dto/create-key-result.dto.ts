import { IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateKeyResultDto {
  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  progress: number;
}
