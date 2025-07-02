import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CacheService } from '../cache.service';

@Injectable()
export class ProductsService {
  private readonly cacheKey = 'products_cache';

  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    private readonly cacheService: CacheService,
  ) { }

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

  async findOne(id: number): Promise<Product> {
    const cacheKey = `product_${id}`;
    const cached = await this.cacheService.get<Product>(cacheKey);

    if (cached) {
      console.log(`Obtenido producto ${id} desde Redis`);
      return cached;
    }

    console.log(`Consultando producto ${id} desde PostgreSQL`);
    const product = await this.productRepo.findOneBy({ id });

    if (!product) {
      throw new Error(`Producto con ID ${id} no encontrado`);
    }

    await this.cacheService.set(cacheKey, product, 20);
    return product;
  }
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
