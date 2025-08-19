import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, UseGuards } from '@nestjs/common';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from 'src/enums/user-role.enum';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('stores')
@UseGuards(JwtAuthGuard)
export class StoresController {
  constructor(private readonly storesService: StoresService) { }

  @Post()
  create(@Body() createStoreDto: CreateStoreDto) {
    return this.storesService.create(createStoreDto);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN_TIENDA)
  @Get()
  findAll() {
    return this.storesService.findAll();
  }

  @Get(':id')
  //! FALTA VALIDAR POR EL storeId
  async findOne(@Param('id') id: string) {
    const store = await this.storesService.findOne(id);
    if (!store) throw new NotFoundException('Store not found');
    return store;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateStoreDto: UpdateStoreDto) {
    const updated = await this.storesService.update(id, updateStoreDto);
    if (!updated) throw new NotFoundException('Store not found');
    return updated;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deleted = await this.storesService.remove(id);
    if (!deleted) throw new NotFoundException('Store not found');
    return { message: 'Store deleted successfully' };
  }
}
