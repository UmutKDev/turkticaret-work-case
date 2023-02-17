import { seeder } from 'nestjs-seeder';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from 'schemas/product.schema';
import { Category, CategorySchema } from 'schemas/category.scheme';
import { ProductsSeeder } from 'src/seeders/products.seeder';

seeder({
  imports: [
    MongooseModule.forRoot(
      `mongodb+srv://umutkiziloglu:n4gSGxQXyCKT1WY7@product.6dc3g9o.mongodb.net/database?retryWrites=true&w=majority`,
    ),
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
}).run([ProductsSeeder]);
