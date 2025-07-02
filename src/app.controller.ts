import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Product } from './products/entities/product.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('cached-products')
  async getCachedProducts(): Promise<Product[]> {
    return this.appService.getCachedProducts();
  }
}
