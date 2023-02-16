import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateOrderDataRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  product_id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  campaign_id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  stock_quantity: number;
}

export class GetOrderDataRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  order_id: number;
}
