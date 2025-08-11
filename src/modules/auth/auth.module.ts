import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Type } from 'class-transformer';
import { User } from '../users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    // TypeOrmModule.forFeature([User])
  ]
})
export class AuthModule { }
