import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DataSource, Entity } from 'typeorm';
import { Store } from '../../stores/entities/store.entity';

@Injectable()
export class StoreValidatorService {
    constructor(private readonly dataSource: DataSource) { }

    async validateStoreExists(storeId: string): Promise<boolean> {
        // 1. Validar entrada
        if (!storeId || typeof storeId !== 'string') {
            throw new BadRequestException('El ID de la tienda es inválido o está vacío');
        }

        // 2. Buscar tienda
        const storeRepo = this.dataSource.getRepository(Store);
        const store = await storeRepo.findOne({
            where: { store_id: storeId.trim() }
        });

        // 3. Manejar no encontrado
        if (!store) {
            throw new NotFoundException(`La tienda con ID "${storeId}" no fue encontrada`);
        }

        // 4. Devolver la tienda encontrada (útil para evitar otra consulta más adelante)
        return true;
    }
}
