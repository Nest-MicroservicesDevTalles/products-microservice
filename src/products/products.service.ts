import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { PrismaClient } from '@prisma/client';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {

  public readonly logger = new Logger('ProductsService');

  public async onModuleInit() {
    await this.$connect();
    this.logger.log(`Database connected`);
  }

  public async create(createProductDto: CreateProductDto) {

    return await this.product.create({
      data: createProductDto
    });

  }

  public async findAll(paginationDto: PaginationDto) {

    const { page, limit } = paginationDto;
    const totalPages: number = await this.product.count({ where: { available: true } });
    const lastPage = Math.ceil(totalPages / limit);

    return {
      data: await this.product.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: {
          available: true
        }
      }),
      meta: {
        total: totalPages,
        page: page,
        lastPage: lastPage
      }
    }

  }

  public async findOne(id: number) {

    const product = await this.product.findFirst({
      where: {
        id,
        available: true
      }
    });

    if (!product) {
      //throw new NotFoundException(`Product with id #${id} not found`);
      //throw new RpcException(`Product with id #${id} not found`);

      throw new RpcException({
        message: `Product with id #${id} not found`,
        status: HttpStatus.BAD_REQUEST
      });

    }

    return product;

  }

  public async update(id: number, updateProductDto: UpdateProductDto) {

    const { id: __, ...data } = updateProductDto;

    await this.findOne(id);

    return this.product.update({
      where: { id },
      data
    });

  }

  public async remove(id: number) {

    await this.findOne(id);

    /*return await this.product.delete({
      where: { id }
    });*/

    const product = this.product.update({
      where: { id },
      data: {
        available: false
      }
    });

    return product;

  }

  public async validateProducts(ids: number[]) {

    ids = Array.from(new Set(ids));

    const products = await this.product.findMany({
      where: {
        id: {
          in: ids
        }
      }
    });

    if (products.length !== ids.length) {
      throw new RpcException({
        message: `Some products where no found`,
        status: HttpStatus.BAD_REQUEST
      })
    }

    return products;

  }

}
