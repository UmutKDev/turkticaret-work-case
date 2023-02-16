import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CampaignDocument = HydratedDocument<Campaign>;

@Schema()
export class Campaign {
  @Prop()
  campaign_id: number;

  @Prop()
  campaign_name: string;

  @Prop()
  campaign_description: string;

  @Prop()
  campaign_type: string;

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
