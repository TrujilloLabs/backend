import { Injectable, ConflictException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { Store } from '../stores/entities/store.entity';
import { User } from '../users/entities/user.entity';
import { IUser } from 'src/interfaces/User.interface';
import { LoginDto } from './dto/login.dto';
import { CreateStoreDto } from '../stores/dto/create-store.dto';
import { Role } from '../../enums/user-role.enum';
@Injectable()
export class AuthService {
  constructor(private readonly dataSource: DataSource,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private jwt: JwtService
  ) {
    // this.usersService = new UsersService();

  }

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
        password: generatedPassword,
        // password: hashedPassword,
      });
      const saveStore = await queryRunner.manager.save(store);

      const user = queryRunner.manager.create(User, {
        name: createStoreDto.name,
        email: createStoreDto.email,
        // password: hashedPassword,
        password: generatedPassword,
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

  async login(
    email: string,
    password: string) {

    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    // const isPasswordValid = await bcrypt.compare(password, user.password);
    // if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');

    if (password !== user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.user_id, email: user.email, role: user.role, store_id: user.store?.store_id ?? null };
    console.log(payload);
    return { access_token: this.jwtService.sign(payload) };
  }







}
