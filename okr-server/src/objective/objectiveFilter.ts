import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Request, Response } from 'express';
import { ObjectiveNotFoundError } from './error/objectiveNotFoundError';
import { DuplicateObjectiveError } from './error/duplicateObjectiveError';

@Catch(ObjectiveNotFoundError, DuplicateObjectiveError)
export class ObjectiveFilter implements ExceptionFilter {
  catch(
    exception: ObjectiveNotFoundError | DuplicateObjectiveError,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response.status(status).json({
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.message,
    });
  }
}
