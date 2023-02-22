import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Document & Product;

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
  author_name: string;

  @Prop()
  list_price: number;

  @Prop()
  stock_quantity: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
