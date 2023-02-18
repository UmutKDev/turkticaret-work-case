import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateOrderDataRequest, GetOrderDataRequest } from 'dto/order.dto';
import { Order } from 'schemas/order.schema';
import { Campaign } from 'schemas/campaign.schema';

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
    });
  }

  @Get('getCampaigns')
  getCampaigns(): string {
    return this.appService.getCampaigns();
  }

  @Post('createCampaign')
  async createCampaign(
    @Body() { campaign_id, campaign_name, discount_rate, max_product_count },
  ): Promise<Campaign> {
    return this.appService.createCampaign({
      campaign_id,
      campaign_name,
      discount_rate,
      max_product_count,
    });
  }

  @Get('getOrderOne')
  async getOrderOne(
    @Query() { order_id }: GetOrderDataRequest,
  ): Promise<Order> {
    return this.appService.getOrderOne({ order_id });
  }
}
