import { seeder } from 'nestjs-seeder';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from 'schemas/product.schema';
import { Category, CategorySchema } from 'schemas/category.schema';
import { ProductsSeeder } from 'src/seeders/products.seeder';
import configuration from '../config/configuration';

seeder({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        uri: config.get('database.host'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
}).run([ProductsSeeder]);
