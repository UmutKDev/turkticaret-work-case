import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Campaign } from 'schemas/campaign.schema';
import { CreateCampaignDataRequest } from 'src/campaign/dto/campaign.dto';

@Injectable()
export class CampaignService {
  constructor(@InjectModel(Campaign.name) private campaignModel) {}

  async createCampaign({
    campaign_id,
    campaign_name,
    discount_rate,
    min_order_amount,
    min_product_count,
    author_name,
    category_id,
  }: CreateCampaignDataRequest): Promise<Campaign> {
    return this.campaignModel.create({
      campaign_id,
      campaign_name,
      discount_rate,
      min_order_amount,
      min_product_count,
      author_name,
      category_id,
    });
  }

  async getCampaigns(): Promise<Campaign[]> {
    return this.campaignModel.find().select('-_id -__v').lean();
  }
}
