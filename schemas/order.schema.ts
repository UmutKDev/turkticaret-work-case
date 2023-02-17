import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type OrderDocument = HydratedDocument<Order>;

@Schema()
export class Order {
  // add object id
  @Prop({
    type: String,
    default: () => new Types.ObjectId(),
    required: true,
    unique: true,
  })
  order_id: string;

  @Prop()
  products: number[];

  @Prop({ type: Types.ObjectId, ref: 'campaign' })
  campaign: number;

  @Prop({ type: Object })
  amount: {
    total: number;
    discount: number;
    discountRate: number;
    cargo: number;
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
