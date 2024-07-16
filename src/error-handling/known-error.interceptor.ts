import { ConflictError } from '@core/errors/conflict-error';
import { UnauthorizedError } from '@core/errors/unauthorized-error';
import {
  BadRequestException,
  CallHandler,
  ConflictException,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  Logger,
  NestInterceptor,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NotFoundError } from '../core/errors/not-found-error';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class KnownErrorInterceptor implements NestInterceptor {
  constructor(private readonly logger: Logger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error: Error) => {
        if (
          error instanceof NotFoundError ||
          (error instanceof PrismaClientKnownRequestError &&
            error.code === 'P2025')
        ) {
          throw new NotFoundException(error.message);
        } else if (error instanceof UnauthorizedError) {
          throw new UnauthorizedException(error.message);
        } else if (error instanceof ConflictError) {
          throw new ConflictException(error.message);
        } else if (
          error instanceof PrismaClientKnownRequestError &&
          error.code === 'P2002'
        ) {
          throw new ConflictException(
            `Unique constraint failed on the ${Array.isArray(error.meta.target) && error.meta.target.length > 1 ? 'fields' : 'field'}: ${[error.meta.target].join(', ')}`,
          );
        } else if (error instanceof BadRequestException) {
          const validationErrors = (error.getResponse() as any).message;
          let message: string;
          if (validationErrors && Array.isArray(validationErrors)) {
            message = validationErrors.join(', ');
          }
          throw new BadRequestException(message ?? error.message);
        } else {
          this.logger.error(error);
          throw new InternalServerErrorException();
        }
      }),
    );
  }
}
