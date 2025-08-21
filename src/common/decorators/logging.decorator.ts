import { Logger } from '@nestjs/common';

/**
 * Los niveles de log que se pueden usar en el decorador.
 */
export type LogLevel = 'log' | 'warn' | 'error' | 'debug' | 'verbose';

/**
 * Decorador de método que registra la entrada, salida y errores de una función.
 * @param level El nivel de log que se usará para registrar la llamada exitosa. Por defecto es 'log'.
 * @returns Un decorador de método.
 */
export function LogMethod(level: LogLevel = 'log') {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        const className = target.constructor.name;
        const logger = new Logger(className);

        descriptor.value = async function (...args: any[]) {
            logger[level](`Calling ${propertyKey} with args: ${JSON.stringify(args)}`);

            try {
                const result = await originalMethod.apply(this, args);
                logger[level](`Method ${propertyKey} executed successfully.`);
                return result;
            } catch (error) {
                // Siempre se usa `error` para los errores, sin importar el nivel especificado.
                logger.error(`Error in ${propertyKey}: ${error.message}`, error.stack);
                throw error;
            }
        };

        return descriptor;
    };
}
