import { IsString } from 'class-validator';

export class ObjectiveDtoType {
  @IsString()
  objective: string;
}
