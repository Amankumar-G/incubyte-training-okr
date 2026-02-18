import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { ObjectiveDtoType } from '../objective/dto/objectiveDtoType';

@Injectable()
export class ParseAppendStringPipe implements PipeTransform {
  transform(value: unknown, metadata: ArgumentMetadata) {
    if (!(value instanceof ObjectiveDtoType)) {
      throw new BadRequestException('ObjectiveDtoType is not matched');
    }

    value = {
      objective: `${value.objective.toString()} Welcome to incubyte`,
    };

    return value;
  }
}
