import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { Type } from 'class-transformer';
import { User } from '../users/entities/user.entity';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TestRolesController } from './test-roles.controller';

@Module({
  controllers: [AuthController, RolesController, TestRolesController],
  providers: [AuthService, RolesService, JwtStrategy],
  imports: [
    // Aquí solo se importan otros módulos
    UsersModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        secret: cfg.get<string>('JWT_SECRET') || 'default_secret',
        signOptions: { expiresIn: cfg.get<string>('JWT_EXPIRES') || '1d' },
      }),
    }),
    TypeOrmModule.forFeature([User, Role, Permission])
  ],
  exports: [AuthService],

})
export class AuthModule { }


// JwtModule.register({
//       secret: process.env.JWT_SECRET || 'secretKey123', // clave privada
//       signOptions: { expiresIn: '1d' }, // duración del token
//     }),