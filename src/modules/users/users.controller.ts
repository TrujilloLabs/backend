import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { Role } from 'src/enums/user-role.enum';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  create(@Body() dto: CreateUserDto, @Req() req) {
    const storeId = req.user.store_id;
    return this.usersService.create(dto, storeId);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN_TIENDA)
  findAll(@Req() req) {
    const storeId = req.user.store_id;
    return this.usersService.findAll(storeId);
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN_TIENDA)
  findOne(@Param('id') userId: string, @Req() req) {
    const storeId = req.user.store_id;
    return this.usersService.findOne(userId, storeId);
  }

  @Patch(':id')
  update(@Param('id') userId: string, @Body() dto: UpdateUserDto, @Req() req) {
    const storeId = req.user.store_id;
    return this.usersService.userToUpdate(userId, dto, storeId);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN_TIENDA)
  remove(@Param('id') userId: string, @Req() req) {
    const storeId = req.user.store_id;
    return this.usersService.userToRemove(userId, storeId);
  }
}
