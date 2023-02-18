import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CampaignService } from './campaign.service';
import { Campaign } from 'schemas/campaign.schema';
import { CreateCampaignDataRequest } from 'src/campaign/dto/campaign.dto';

@Controller('campaign')
@ApiTags('Campaign API Endpoints')
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  @Post('create')
  async createCampaign(
    @Body()
    {
      campaign_id,
      campaign_name,
      discount_rate,
      max_product_count,
      author_name,
      category_id,
      min_cost,
    }: CreateCampaignDataRequest,
  ): Promise<Campaign> {
    return this.campaignService.createCampaign({
      campaign_id,
      campaign_name,
      discount_rate,
      max_product_count,
      author_name,
      category_id,
      min_cost,
    });
  }

  @Get('all')
  async getCampaigns(): Promise<Campaign[]> {
    return this.campaignService.getCampaigns();
  }
}
