import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CampaignDocument = HydratedDocument<Campaign>;

@Schema()
export class Campaign {
  @Prop({ required: true, unique: true })
  campaign_id: number;

  @Prop({ required: true })
  campaign_name: string;

  @Prop()
  discount_rate: number;

  @Prop()
  min_order_amount: number;

  @Prop()
  min_product_count: number;

  @Prop({ default: '' })
  author_name: string;

  @Prop()
  category_id: number;

  @Prop({ type: Object, default: { start: new Date() } })
  date: {
    start: Date;
    end: Date;
  };
}

export const CampaignSchema = SchemaFactory.createForClass(Campaign);
