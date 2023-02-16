import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

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
  @Transform(({ value }) => Number(value))
  @IsNotEmpty()
  @IsNumber()
  order_id: number;
}
