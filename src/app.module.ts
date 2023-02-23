import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderService } from './order/order.service';
import { OrderController } from './order/order.controller';
import { CampaignService } from './campaign/campaign.service';
import { CampaignController } from './campaign/campaign.controller';
import { Product, ProductSchema } from 'schemas/product.schema';
import { Order, OrderSchema } from 'schemas/order.schema';
import { Campaign, CampaignSchema } from 'schemas/campaign.schema';
import { Category, CategorySchema } from 'schemas/category.schema';
import configuration from '../config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        uri: config.get('database.host'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Order.name, schema: OrderSchema },
      { name: Campaign.name, schema: CampaignSchema },
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
  controllers: [AppController, OrderController, CampaignController],
  providers: [OrderService, CampaignService],
})
export class AppModule {}
