import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateOrderDataRequest, GetOrderDataRequest } from 'dto/order.dto';
import { Order } from 'schemas/order.scheme';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('createOrder')
  async createOrder(
    @Body() { product_id, campaign_id, stock_quantity }: CreateOrderDataRequest,
  ): Promise<Order> {
    return this.appService.createOrder({
      product_id,
      campaign_id,
      stock_quantity,
    });
  }

  @Get('getCampaigns')
  getCampaigns(): string {
    return this.appService.getCampaigns();
  }

  @Get('getOrderOne')
  async getOrderOne(
    @Query() { order_id }: GetOrderDataRequest,
  ): Promise<Order> {
    return this.appService.getOrderOne({ order_id });
  }
}
