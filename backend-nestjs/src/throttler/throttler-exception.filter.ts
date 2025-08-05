import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { ThrottlerException } from '@nestjs/throttler';
import { error } from 'console';

@Catch(ThrottlerException)
export class ThrottlerExceptionFilter implements ExceptionFilter {
  catch(exception: ThrottlerException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    response.status(HttpStatus.TOO_MANY_REQUESTS).json({
      error: 'Too Many Requests',
      statusCode: 429,
      message: 'Bạn thao tác quá nhanh. Vui lòng chờ một chút.',
    });
  }
}
