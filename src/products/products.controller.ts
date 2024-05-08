import { PaginationDto } from 'src/common';
import { Controller, ParseIntPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';


@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @MessagePattern({ cmd: 'create_product' })
  public async create(@Payload() createProductDto: CreateProductDto) {

    return await this.productsService.create(createProductDto);

  }

  @MessagePattern({ cmd: 'find_all_products' })
  public async findAll(@Payload() paginationDto: PaginationDto) {

    return await this.productsService.findAll(paginationDto);

  }

  @MessagePattern({ cmd: 'find_one_product' })
  public async findOne(@Payload('id', ParseIntPipe) id: number) {

    return await this.productsService.findOne(+id);

  }

  @MessagePattern({ cmd: 'update_product' })
  public async update(@Payload() updateProductDto: UpdateProductDto) {

    return await this.productsService.update(updateProductDto.id, updateProductDto);

  }

  @MessagePattern({ cmd: 'delete_product' })
  public async remove(@Payload('id', ParseIntPipe) id: number) {

    return await this.productsService.remove(id);

  }

  @MessagePattern({ cmd: 'validate_product' })
  public async validateProduct(@Payload() ids: number[]) {

    return await this.productsService.validateProducts(ids);

  }

}
