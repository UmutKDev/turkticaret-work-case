import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OrderService } from './order.service';
import {
  CreateOrderDataRequest,
  GetOrderDataRequest,
} from 'src/order/dto/order.dto';
import { Order } from 'schemas/order.schema';
import type { FindOrderResponse } from 'src/order/interfaces/FindOrderResponse';

@Controller('order')
@ApiTags('Order API Endpoints')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('create')
  async createOrder(
    @Body()
    { products, campaign_id }: CreateOrderDataRequest,
  ): Promise<Order> {
    return this.orderService.createOrder({
      products,
      campaign_id,
    });
  }

  @Get('find')
  async getOrderOne(
    @Query() { order_id }: GetOrderDataRequest,
  ): Promise<FindOrderResponse> {
    return this.orderService.getOrderOne({ order_id });
  }
}
