import { Injectable, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Campaign } from 'schemas/campaign.schema';

@Injectable()
export class CampaignService {
  constructor(@InjectModel(Campaign.name) private campaignModel) {}

  async getCampaigns(): Promise<Campaign[]> {
    return this.campaignModel.find().select('-_id -__v').lean();
  }

  async createCampaign({
    campaign_id,
    campaign_name,
    discount_rate,
    max_product_count,
    author_name,
    category_id,
    min_cost,
  }): Promise<Campaign> {
    return this.campaignModel.create({
      campaign_id: 1,
      campaign_name:
        "Sabahattin Ali'nin Roman kitaplarında 2 üründen 1 tanesi bedava.",
      discount_rate: 50,
      max_product_count: 2,
      author_name: 'Sabahattin Ali',
      category_title: 'Roman',
    });
  }
}
