import { Injectable } from '@nestjs/common';
import { CacheService } from './cache.service';
import { Product } from './products/entities/product.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AppService {
  private readonly cacheKey = 'products_cache';

  constructor(
    private readonly cacheService: CacheService,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async getCachedProducts(): Promise<Product[]> {
    const cached = await this.cacheService.get<Product[]>(this.cacheKey);
    if (cached) {
      return cached;
    }

    const products = await this.productRepo.find();

    await this.cacheService.set(this.cacheKey, products, 20);

    return products;
  }
}
