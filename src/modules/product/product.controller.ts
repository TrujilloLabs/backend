import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from 'src/enums/user-role.enum';
import { StoreId } from '../auth/decorators/store-id.decorator';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductResponseDto } from './dto/product-response.dto';
import { CreateCategoryDto } from '../categories/dto/create-category.dto';
import { PaginatedResponseDto } from './dto/paginated-response.dto';
import { PaginationDto } from './dto/pagination.dto';
import { ProductFilterDto } from './dto/product-filter.dto';

@ApiTags('Product')
@ApiBearerAuth()
@Controller('product')
@UseGuards(JwtAuthGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) { }



  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN_TIENDA)
  @ApiResponse({
    status: 201,
    description: 'Product created successfully',
    type: ProductResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid category for this store' })
  create(
    @Body() dto: CreateProductDto,
    @StoreId() storeId: string,
    // @Req() req
  ) {
    return this.productService.createProduct(dto, storeId);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener productos paginados por tienda' })
  @ApiResponse({
    status: 200,
    description: 'Lista de productos paginada',
    type: PaginatedResponseDto<ProductResponseDto>,
  })
  async findAll(
    @StoreId() storeId: string,
    @Query() paginationDto: PaginationDto,
    @Query() filterDto: ProductFilterDto
  ): Promise<PaginatedResponseDto<ProductResponseDto>> {
    return this.productService.findAllByStoreId(
      storeId,
      paginationDto,
      filterDto
    );
  }

  /// TODO :  Fin

  // @Get()
  // findAll() {
  //   return this.productService.findAll();
  // }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
