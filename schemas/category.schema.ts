import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CampaignDocument = HydratedDocument<Category>;

@Schema()
export class Category {
  @Prop()
  category_id: number;

  @Prop()
  title: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
