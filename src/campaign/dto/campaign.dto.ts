import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateCampaignDataRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  campaign_id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  campaign_name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  campaign_type: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  min_cost: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  max_product_count: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  discount_rate: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  author_name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  category_id: string;
}
