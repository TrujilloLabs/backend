import { Logger } from "@nestjs/common";




export function logFindOneAttempt(logger: Logger, id: string): void {
    logger.log(`Fetching subcategory with ID: ${id}`);
}