import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type OrderDocument = HydratedDocument<Order>;

@Schema()
export class Order {
  @Prop()
  order_id: number;

  @Prop({ type: Types.ObjectId, ref: 'product' })
  product_id: number;

  @Prop({ type: Types.ObjectId, ref: 'campaign' })
  campaign_id: number;

  //   @Prop({ type: Types.ObjectId, ref: 'user_id' })
  //   user_id: number;

  @Prop()
  created_at: Date;

  @Prop()
  updated_at: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
