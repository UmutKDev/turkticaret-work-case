import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from 'schemas/order.scheme';
import { Campaign } from 'schemas/campaign.scheme';
import { Product } from 'schemas/product.schema';
import { ObjectId } from 'mongoose';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Order.name) private orderModel,
    @InjectModel(Campaign.name) private campaignModel,
    @InjectModel(Product.name) private productModel,
  ) {}

  async createOrder({
    product_id,
    campaign_id,
    stock_quantity,
  }): Promise<Order> {
    try {
      const response = await this.orderModel.create({
        product: product_id,
        campaign: campaign_id,
      });

      return {
        order_id: response.order_id,
        product: response.product,
        campaign: response.campaign,
        date: response.date,
      };
    } catch (error) {
      console.log(error);
    }
  }

  getCampaigns(): string {
    return 'This action returns all campaigns';
  }

  async getOrderOne({ order_id }): Promise<Order> {
    try {
      const response = await this.orderModel
        .findOne({ order_id })
        .select('-_id order_id product campaign')
        .populate('product', '-_id product_id product_name')
        .lean();

      console.log(response);

      return response;
    } catch (error) {
      console.log(error);
    }
  }
}
