import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CampaignDocument = HydratedDocument<Campaign>;

@Schema()
export class Campaign {
  @Prop()
  campaign_id: number;

  @Prop()
  campaign_name: string;

  @Prop({ enum: ['mincostdiscount', 'onebookdiscount'] })
  campaign_type: string;

  @Prop()
  min_cost: number;

  @Prop()
  max_product_count: number;

  @Prop({ type: Types.Buffer })
  discount_rate: number;

  @Prop()
  author_name: string;

  @Prop()
  category_id: string;

  @Prop()
  campaign_start_date: Date;

  @Prop()
  campaign_end_date: Date;

  @Prop()
  campaign_status: string;

  @Prop()
  created_at: Date;

  @Prop()
  updated_at: Date;
}

export const CampaignSchema = SchemaFactory.createForClass(Campaign);
