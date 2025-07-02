import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './products/entities/product.entity';
import { ProductsModule } from './products/products.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { CacheService } from './cache.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',          
      password: 'Colita2010',    
      database: 'ejercicio3-avanzado-redis',     
      entities: [Product],
      synchronize: true,          
    }),
    TypeOrmModule.forFeature([Product]),
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [AppService, CacheService],
})
export class AppModule {}
