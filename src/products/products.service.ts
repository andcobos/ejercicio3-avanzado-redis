import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CacheService } from '../cache.service';
import { faker } from '@faker-js/faker';

@Injectable()
export class ProductsService {
  private readonly cacheKey = 'products_cache';

  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    private readonly cacheService: CacheService,
  ) {}

  async findAll(): Promise<Product[]> {
    const cached = await this.cacheService.get<Product[]>(this.cacheKey);
    if (cached) {
      console.log('Obtenido desde Redis (cache)');
      return cached;
    }

    console.log('Consultando desde la base de datos (PostgreSQL)');
    const products = await this.productRepo.find();
    await this.cacheService.set(this.cacheKey, products, 20);
    return products;
  }

  // // Método opcional para poblar
  // async seedProducts(): Promise<string> {
  //   const products = Array.from({ length: 1000 }).map(() => {
  //     return this.productRepo.create({
  //       name: faker.commerce.productName(),
  //       price: parseFloat(faker.commerce.price({ min: 5, max: 100 })),
  //     });
  //   });

  //   await this.productRepo.save(products);
  //   return 'Se insertaron 1,000 productos correctamente.';
  // }
}
