import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import * as Joi from 'joi';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpExceptionFilter } from './error-handling/http-exception.filter';
import { KnownErrorInterceptor } from './error-handling/known-error.interceptor';
import { RequestIdMiddleware } from './middleware/request-id.middleware';
import { RequestLoggerMiddleware } from './middleware/request-logger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'staging')
          .default('development'),
        PORT: Joi.number().port().default(3000),
        CORS_ORIGINS: Joi.string().default('*'),
        DATABASE_URL: Joi.string(),
        JWT_ACCESS_TOKEN_SECRET: Joi.string(),
        JWT_ACCESS_TOKEN_TTL: Joi.string().default('300s'),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
  ],
  controllers: [AppController],
  providers: [
    Logger,
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: KnownErrorInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
