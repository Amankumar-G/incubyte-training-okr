import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { ObjectiveNotFoundException } from '../exceptions/objective-not-found-exception';
import { Response } from 'express';

@Catch(ObjectiveNotFoundException)
export class ObjectiveFilter implements ExceptionFilter {
  catch(exception: ObjectiveNotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse();

    response.status(exception.getStatus()).json({
      statusCode: exception.getStatus(),
      error: exception.message,
      timestamp: new Date().toISOString(),
    });
  }
}
