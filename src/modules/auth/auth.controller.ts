import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { CreateStoreDto } from '../stores/dto/create-store.dto';
import { AuthStore } from 'src/interfaces/auth-store.interface';
import * as RequestWithUserInterface from 'src/interfaces/RequestWithUser.interface';
import { AuthGuard } from '@nestjs/passport';
import { Role } from 'src/enums/user-role.enum';
// import { Request } from 'express';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post()
  // @UseGuards(AuthGuard, RolesGuard)
  //  @Roles(Role.SUPER_ADMIN) // Solo el SUPER_ADMIN puede crear tiendas
  async createStore(
    @Body() createStoreDto: CreateStoreDto,
    // @Req() req: RequestWithUserInterface.RequestWithUser,
  ) {
    // const storeId = req.store
    return this.authService.authCreateStore(createStoreDto);
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.authService.login(email, password);
  }

}
