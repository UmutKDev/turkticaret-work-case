import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateOrderDataRequest {
  @ApiProperty()
  @IsNotEmpty()
  products: {
    id: number;
    quantity: number;
  }[];

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  campaign_id: number;
}

export class GetOrderDataRequest {
  @ApiProperty()
  @IsNotEmpty()
  order_id: string;
}
