import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type CategoryDocument = Document & Category;

@Schema()
export class Category {
  @Prop()
  category_id: number;

  @Prop()
  title: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
