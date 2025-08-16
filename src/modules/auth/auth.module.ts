import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Type } from 'class-transformer';
import { User } from '../users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    // Aquí solo se importan otros módulos
    UsersModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secretKey123', // clave privada
      signOptions: { expiresIn: '1d' }, // duración del token
    }),
    // TypeOrmModule.forFeature([User])
  ]
})
export class AuthModule { }
