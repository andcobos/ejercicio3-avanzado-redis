import { Controller, Get, Post } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  //poblar
  // @Post('seed')
  // seedProducts() {
  //   return this.productsService.seedProducts();
  // }
}
