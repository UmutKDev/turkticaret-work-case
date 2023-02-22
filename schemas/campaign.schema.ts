import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type CampaignDocument = HydratedDocument<Campaign>;

@Schema()
export class Campaign {
  @ApiProperty()
  @Prop({ required: true, unique: true })
  campaign_id: number;

  @ApiProperty()
  @Prop({ required: true })
  campaign_name: string;

  @ApiProperty({ required: false })
  @Prop({ required: false })
  min_order_amount: number;

  @ApiProperty({ required: false })
  @Prop({ required: false })
  min_product_count: number;

  @ApiProperty({ required: true })
  @Prop({ type: Types.Buffer, required: true })
  discount_rate: number;

  @Prop({ required: false })
  author_name: string;

  @Prop({ required: false })
  category_id: number;

  @Prop({ type: Object, default: { start: new Date() } })
  date: {
    start: Date;
    end: Date;
  };
}

export const CampaignSchema = SchemaFactory.createForClass(Campaign);
