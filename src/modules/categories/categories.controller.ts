import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ParseUUIDPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from 'src/enums/user-role.enum';
import { AuthStore } from 'src/interfaces/auth-store.interface';
import { StoreId } from '../auth/decorators/store-id.decorator';
import { ICategory } from 'src/interfaces/category.interface';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('categories')
@ApiBearerAuth()
@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN_TIENDA)
  create(@Body() dto: CreateCategoryDto, @Req() req) {
    const storeId = req.user.store_id;
    return this.categoriesService.categoryToCreate(dto, storeId);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN_TIENDA)
  findAll(@Req() req) {
    const storeId = req.user.store_id;
    return this.categoriesService.categoryToFindAll(storeId);
  }


  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN_TIENDA)
  findOne(
    @Param('id') categoryId: string,
    @StoreId() storeId: string,
    @Req() req) {
    return this.categoriesService.findCategoryByIdAndStore(categoryId, storeId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) categoryId: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @StoreId() storeId: string,
  ): Promise<ICategory> {
    return this.categoriesService.updateCategory(categoryId, storeId, updateCategoryDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN_TIENDA)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('id', ParseUUIDPipe) categoryId: string,
    @StoreId() storeId: string,
  ) {
    return this.categoriesService.deleteCategory(categoryId, storeId);
  }

  // Para restaurar categorías eliminadas:
  @Patch(':id/restore')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN_TIENDA)
  restore(
    @Param('id', ParseUUIDPipe) categoryId: string,
    @StoreId() storeId: string,
  ) {
    return this.categoriesService.restoreCategory(categoryId, storeId);
  }
}
