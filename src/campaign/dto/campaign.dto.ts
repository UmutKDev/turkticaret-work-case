import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateCampaignDataRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  campaign_id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  campaign_name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  discount_rate: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  min_order_amount: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  min_product_count: number;

  @ApiProperty()
  author_name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  category_id: number;
}
