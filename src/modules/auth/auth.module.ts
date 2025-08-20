import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Type } from 'class-transformer';
import { User } from '../users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
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
    // TypeOrmModule.forFeature([User])
  ],
  exports: [AuthService],

})
export class AuthModule { }


// JwtModule.register({
//       secret: process.env.JWT_SECRET || 'secretKey123', // clave privada
//       signOptions: { expiresIn: '1d' }, // duración del token
//     }),