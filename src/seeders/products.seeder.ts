import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Seeder } from 'nestjs-seeder';
import { Product } from 'schemas/product.schema';
import { Category } from 'schemas/category.scheme';
import * as products from 'static/products.json';

@Injectable()
export class ProductsSeeder implements Seeder {
  constructor(
    @InjectModel(Product.name) private productModel,
    @InjectModel(Category.name) private categoryModel,
  ) {}

  async seed() {
    const data = products.map((item) => {
      return {
        product_id: item.product_id,
        title: item.title,
        category_id: item.category_id,
        author: item.author,
        list_price: item.list_price,
        stock_quantity: item.stock_quantity,
      };
    });

    await this.productModel.insertMany(data);

    const categories = products.reduce((acc, item) => {
      if (!acc.find((category) => category.category_id === item.category_id)) {
        acc.push({
          category_id: item.category_id,
          title: item.category_title,
        });
      }
      return acc;
    }, []);

    await this.categoryModel.insertMany(categories);
  }

  async drop() {
    await this.productModel.deleteMany({});
    await this.categoryModel.deleteMany({});
  }
}
