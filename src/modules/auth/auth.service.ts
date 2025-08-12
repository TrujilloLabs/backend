import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { CreateStoreDto } from '../stores/dto/create-store.dto';
// import { AuthStore } from '../../../dist/interfaces/auth-store.interface';
import { Store } from '../stores/entities/store.entity';
import { User } from '../users/entities/user.entity';
import { Role } from '../users/enums/user-role.enum';




@Injectable()
export class AuthService {
  constructor(
    private readonly dataSource: DataSource

  ) { }

  // Crear admin de tienda default: email pattern o venir en DTO
  private adminPassword = Math.random().toString(36).slice(-8);
  private hashed = bcrypt.hash(this.adminPassword, 10);


  async authCreateStore(createStoreDto) {
    const storeRepo = this.dataSource.getRepository(Store);
    const store = storeRepo.create({
      name: createStoreDto.name,
      logo_url: createStoreDto.logo_url,
      description: createStoreDto.description,
      email: createStoreDto.email,
      password: await this.hashed, // Contraseña por defecto para el admin de la tienda
      // state: (createStoreDto.state as 'activa' | 'inactiva') ?? 'inactiva', // Usa 'inactiva' si no viene en el DTO
    });
    const savedStore = await storeRepo.save(store);
    console.log(`Contraseña generada para el admin de la tienda: ${this.adminPassword}`);

    const userRepo = this.dataSource.getRepository(User),
      user = userRepo.create({
        name: createStoreDto.name,
        email: createStoreDto.email,
        password: await this.hashed, // Contraseña por defecto para el admin de la tienda
        role: Role.ADMIN_TIENDA,
      });
    const savedUser = await this.dataSource.getRepository(User).save(user);
    return {
      store: savedStore,
      user: savedUser,
      message: `Tienda creada con éxito. Contraseña generada para el admin de la tienda: ${this.adminPassword}`,
    };
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
