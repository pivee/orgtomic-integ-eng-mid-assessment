import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(request: Request, response: Response, next: NextFunction) {
    if (!request.headers['x-request-id']) {
      const requestId = uuidv4();
      request.headers['x-request-id'] = requestId;
    }
    next();
  }
}
