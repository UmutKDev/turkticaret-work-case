import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsArray } from 'class-validator';

export class CreateOrderDataRequest {
  @ApiProperty({
    type: [Object],
    isArray: true,
    allOf: [
      {
        type: 'object',
        properties: {
          id: { type: 'number' },
          quantity: { type: 'number' },
        },
      },
    ],
  })
  @IsNotEmpty()
  @IsArray()
  products: Array<{ id: number; quantity: number }>;
}

export class GetOrderDataRequest {
  @ApiProperty()
  @IsNotEmpty()
  order_id: string;
}
