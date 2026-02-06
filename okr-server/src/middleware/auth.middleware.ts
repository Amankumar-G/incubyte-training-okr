import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.method === 'OPTIONS') {
      return res.sendStatus(204);
    }
    next();
  }
}
