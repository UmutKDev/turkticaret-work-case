import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type OrderDocument = HydratedDocument<Order>;

@Schema()
export class Order {
  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  order_id: string;

  @Prop({ required: true })
  products: number[];

  @Prop({ required: false })
  campaign_id: number;

  @Prop({ type: Object })
  amount: {
    total: number;
    totalWithDiscount: number;
    discount: number;
    shippment: number;
  };

  @Prop({
    type: Object,
    default: { created: new Date(), updated: new Date() },
  })
  date: {
    created: Date;
    updated: Date;
  };
}

export const OrderSchema = SchemaFactory.createForClass(Order);
