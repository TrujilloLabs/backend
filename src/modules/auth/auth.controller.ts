import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { CreateStoreDto } from '../stores/dto/create-store.dto';
import { AuthStore } from 'src/interfaces/auth-store.interface';
import * as RequestWithUserInterface from 'src/interfaces/RequestWithUser.interface';
import { AuthGuard } from '@nestjs/passport';
import { Role } from 'src/enums/user-role.enum';
import { LoginDto } from './dto/login.dto';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { JwtAuthGuard } from './guards/jwt.guard';
// import { Request } from 'express';


@Controller('auth')
// @UseGuards(JwtAuthGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post()
  // @UseGuards(RolesGuard)
  // @Roles(Role.SUPER_ADMIN) // Solo el SUPER_ADMIN puede crear tiendas
  async createStore(
    @Body() createStoreDto: CreateStoreDto,
    // @Req() req: RequestWithUserInterface.RequestWithUser,
  ) {
    // const storeId = req.store
    return this.authService.authCreateStore(createStoreDto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

}
