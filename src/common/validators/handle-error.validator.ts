import { ConflictException, InternalServerErrorException, NotFoundException } from "@nestjs/common";


export function handleUpdateError(error: any, id: string): never {
    if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
    }

    this.logger.error(`Error updating subcategory ${id}: ${error.message}`, error.stack);
    throw new InternalServerErrorException('Error al actualizar la subcategoría');
}