// http-exception.filter.ts
import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpStatus,
    InternalServerErrorException,
    ConflictException,
    HttpException,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';

        // Manejo de ConflictException (nombre duplicado)
        if (exception instanceof ConflictException) {
            status = exception.getStatus();
            message = exception.message;
        }
        // Manejo de errores de TypeORM (duplicados en BD)
        else if (exception instanceof QueryFailedError) {
            if (exception.driverError?.code === '23505') { // Código de violación de unique constraint
                status = HttpStatus.CONFLICT;
                message = 'Duplicate entry: some data already exists';
            }
        }
        // Manejo genérico de otras excepciones HTTP de Nest
        else if (exception instanceof HttpException) {
            status = exception.getStatus();
            message = exception.message;
        }

        response.status(status).json({
            statusCode: status,
            message: message,
            timestamp: new Date().toISOString(),
        });
    }
}