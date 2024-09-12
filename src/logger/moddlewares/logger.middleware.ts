import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('---------------------------------');
    console.log('Request...');
    console.log(`Request Method: ${req.method}`);
    console.log(`Request URL: ${req.originalUrl}`);
    if (req.method === 'POST') {
      console.log(`Request Body: ${JSON.stringify(req.body)}`);
    }
    console.log('---------------------------------');
    next();
  }
}
