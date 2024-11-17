// prisma.error.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { Prisma } from '@prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaErrorFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    switch (exception.code) {
      // Unique constraint violation
      case 'P2002': {
        status = HttpStatus.CONFLICT;
        const field = (exception.meta?.target as string[])?.join(', ');
        message = `Unique constraint violation. Field: ${field}`;
        break;
      }

      // Record not found
      case 'P2025': {
        status = HttpStatus.NOT_FOUND;
        message = 'Record not found';
        break;
      }

      // Foreign key constraint violation
      case 'P2003': {
        status = HttpStatus.BAD_REQUEST;
        const field = exception.meta?.field_name as string;
        message = `Foreign key constraint violation. Field: ${field}`;
        break;
      }

      // Required field constraint violation
      case 'P2011': {
        status = HttpStatus.BAD_REQUEST;
        message = 'Required field constraint violation';
        break;
      }

      // Invalid data type
      case 'P2006': {
        status = HttpStatus.BAD_REQUEST;
        message = 'Invalid data provided';
        break;
      }

      default: {
        if (process.env.NODE_ENV === 'development') {
          message = `${exception.message} (Code: ${exception.code})`;
        }
        break;
      }
    }

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: ctx.getRequest().url,
    });
  }
}
