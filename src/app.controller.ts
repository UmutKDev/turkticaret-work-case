import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateOrderDataRequest } from 'dto/order.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('createOrder')
  createOrder(
    @Body() { product_id, stock_quantity }: CreateOrderDataRequest,
  ): string {
    return this.appService.createOrder({ product_id, stock_quantity });
  }

  @Get('getCampaigns')
  getCampaigns(): string {
    return this.appService.getCampaigns();
  }

  @Get('getOrderOne')
  getOrderOne(): string {
    return this.appService.getOrderOne();
  }
}
