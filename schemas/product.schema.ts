import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema()
export class Product {
  @Prop()
  product_id: number;

  @Prop()
  title: string;

  @Prop()
  category_id: number;

  @Prop()
  category_title: string;

  @Prop()
  author: string;

  @Prop()
  list_price: number;

  @Prop()
  stock_quantity: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
