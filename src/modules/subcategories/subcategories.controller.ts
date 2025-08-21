import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { SubcategoriesService } from './subcategories.service';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from 'src/enums/user-role.enum';
import { SubcategoryResponseDto } from './dto/subcategory-response.dto';
import { StoreId } from '../auth/decorators/store-id.decorator';
import { CategoryResponseDto } from '../categories/dto/category-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';


@ApiTags('subcategories')
@Controller('subcategories')
@UseGuards(JwtAuthGuard)
export class SubcategoriesController {
  constructor(private readonly subcategoriesService: SubcategoriesService) { }


  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.ADMIN_TIENDA)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new subcategory' })
  @ApiBody({ type: CreateSubcategoryDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'SubCategory created successfully',
    type: SubcategoryResponseDto
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'SubCategory name already exists in this store'
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Store or parent subcategory not found'
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data'
  })
  @Post()
  create(
    @Body() createSubcategoryDto: CreateSubcategoryDto,
    @StoreId() storeId: string
  ): Promise<CategoryResponseDto> {
    return this.subcategoriesService.create(createSubcategoryDto, storeId);
  }





  //TODO : MEYODOS
  @Get()
  findAll() {
    return this.subcategoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subcategoriesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSubcategoryDto: UpdateSubcategoryDto) {
    return this.subcategoriesService.update(+id, updateSubcategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subcategoriesService.remove(+id);
  }
}
