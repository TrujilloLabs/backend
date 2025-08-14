import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { CreateStoreDto } from '../stores/dto/create-store.dto';
import { Store } from '../stores/entities/store.entity';
import { User } from '../users/entities/user.entity';
import { Role } from '../../enums/user-role.enum';

@Injectable()
export class AuthService {
  constructor(private readonly dataSource: DataSource) { }

  async authCreateStore(createStoreDto: CreateStoreDto) {
    const generatedPassword = this.generateRandomPassword();
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const store = queryRunner.manager.create(Store, {
        name: createStoreDto.name,
        logo_url: createStoreDto.logo_url,
        description: createStoreDto.description,
        email: createStoreDto.email,
        password: hashedPassword,
      });
      const saveStore = await queryRunner.manager.save(store);

      const user = queryRunner.manager.create(User, {
        name: createStoreDto.name,
        email: createStoreDto.email,
        password: hashedPassword,
        role: Role.ADMIN_TIENDA,
        store: { store_id: saveStore.store_id }
      });

      await queryRunner.manager.save(user);

      await queryRunner.commitTransaction();

      return {
        store,
        user,
        message: `Tienda creada con éxito. Contraseña generada para el admin de la tienda: ${generatedPassword}`,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (error.code === '23505') {
        // Código de error de Postgres para violación de UNIQUE
        throw new ConflictException('El correo electrónico ya está registrado.');
      }

      throw new InternalServerErrorException('Error al crear la tienda y el usuario.');
    } finally {
      await queryRunner.release();
    }
  }

  private generateRandomPassword(length = 10): string {
    return Math.random().toString(36).slice(-length);
  }

  async login(email: string, password: string) {

  }







}
