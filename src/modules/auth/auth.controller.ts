import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { CreateStoreDto } from '../stores/dto/create-store.dto';
import { AuthStore } from 'src/interfaces/auth-store.interface';
import * as RequestWithUserInterface from 'src/interfaces/RequestWithUser.interface';
// import { Request } from 'express';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post()
  // @UseGuards(AuthGuard, RolesGuard)
  //  @Roles(UserRole.SUPER_ADMIN) // Solo el SUPER_ADMIN puede crear tiendas
  async createStore(
    @Body() createStoreDto: CreateStoreDto,
    // @Req() req: RequestWithUserInterface.RequestWithUser,
  ) {
    // const storeId = req.store
    return this.authService.authCreateStore(createStoreDto);
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
  //   return this.authService.update(+id, updateAuthDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
