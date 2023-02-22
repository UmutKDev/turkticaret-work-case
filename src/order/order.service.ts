import { Injectable, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from 'schemas/order.schema';
import { Campaign } from 'schemas/campaign.schema';
import { Product } from 'schemas/product.schema';
import { Category } from 'schemas/category.schema';
import type { OrderResponse } from 'src/order/interfaces/Order.interface';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel,
    @InjectModel(Campaign.name) private campaignModel,
    @InjectModel(Product.name) private productModel,
    @InjectModel(Category.name) private categoryModel,
  ) {}

  async createOrder({ products }): Promise<OrderResponse> {
    const productIds = products.map((product) => product.id);
    const productQuantities = products.map((product) => product.quantity);
    const productStocks = await this.productModel
      .find({ product_id: { $in: productIds } })
      .select('stock_quantity product_id -_id list_price author category_id')
      .lean();

    const isStockAvailable = productStocks.every(
      (productStock, index) =>
        productStock.stock_quantity >= productQuantities[index],
    );

    if (!isStockAvailable) {
      const notAvailableProduct = productStocks.find(
        (productStock, index) =>
          productStock.stock_quantity < productQuantities[index],
      );

      throw new HttpException(
        `Product IDs: ${notAvailableProduct.product_id} is not available in stock`,
        400,
      );
    }

    let totalPrice = productStocks.reduce(
      (total, productStock, index) =>
        total + productStock.list_price * productQuantities[index],
      0,
    );

    let discountPrice = 0;

    const campaigns = await this.campaignModel.find().lean();

    const campaignauthorname = productStocks.filter((item) =>
      campaigns.some(
        (campaign) =>
          campaign.author_name === item.author &&
          item.category_id === campaign.category_id,
      ),
    );

    const foundCampaignData = await this.campaignModel.findOne({
      author_name: campaignauthorname[0].author,
      category_id: campaignauthorname[0].category_id,
    });

    const discountRate = foundCampaignData.discount_rate;
    const minOrderAmount = foundCampaignData.min_order_amount;
    const minProductCount = foundCampaignData.min_product_count;

    let campaignItemQuantity = 0;

    products.filter((f) =>
      productStocks
        .filter(
          (pS) =>
            pS.product_id === f.id &&
            pS.author === campaignauthorname[0].author,
        )
        .map(() => (campaignItemQuantity += f.quantity)),
    );

    if (campaignItemQuantity >= minProductCount) {
      productStocks.map((item) => (totalPrice += item.list_price));
      const topPrice = Math.max(...campaignauthorname.map((o) => o.list_price));
      if (Number(totalPrice) > minOrderAmount) {
        if (
          totalPrice - topPrice <
          totalPrice - (totalPrice / 100) * discountRate
        ) {
          discountPrice = totalPrice - topPrice;
        } else {
          discountPrice = totalPrice - totalPrice / (100 * discountRate);
        }
      } else {
        discountPrice = totalPrice - topPrice;
      }
    } else {
      productStocks.map((item) => (totalPrice += item.list_price));
      if (Number(totalPrice) > minOrderAmount) {
        discountPrice = totalPrice - totalPrice / (100 * discountRate);
      } else {
        discountPrice = 0;
      }
    }

    const isShippmentDiscountAvailable = totalPrice > 150;

    const order = await this.orderModel.create({
      order_id: Math.floor(Math.random() * 1000000),
      products: productStocks.map((productStock) => productStock.product_id),
      campaign_id: foundCampaignData ? foundCampaignData.campaign_id : null,
      amount: {
        total: totalPrice,
        totalWithDiscount: discountPrice,
        discount: foundCampaignData ? foundCampaignData.discount_rate : 0,
        shippment: isShippmentDiscountAvailable ? 0 : 35,
      },
    });

    return {
      order_id: order.order_id,
      products: productStocks.map((productStock) => ({
        id: productStock.product_id,
        title: productStock.title,
        list_price: productStock.list_price,
        stock_quantity: productStock.stock_quantity,
      })),
      campaign: {
        id: foundCampaignData ? foundCampaignData.campaign_id : null,
        name: foundCampaignData ? foundCampaignData.campaign_name : null,
        discount_rate: foundCampaignData ? foundCampaignData.discount_rate : 0,
      },
      amount: {
        total: order.amount.total,
        totalWithDiscount: order.amount.totalWithDiscount,
        discount: order.amount.discount,
        shippment: order.amount.shippment,
      },
      date: order.date,
    };
  }

  async getOrderOne({ order_id }): Promise<OrderResponse> {
    const order = await this.orderModel
      .findOne({ order_id })
      .select('-_id, -__v')
      .lean();

    const campaign = await this.campaignModel
      .findOne({ campaign_id: order.campaign_id })
      .select('-_id, -__v')
      .lean();

    const products = await this.productModel
      .find({ product_id: { $in: order.products } })
      .select('-_id, -__v')
      .lean();

    return {
      order_id: order.order_id,
      products: products.map((product) => ({
        id: product.product_id,
        title: product.title,
        list_price: product.list_price,
        stock_quantity: product.stock_quantity,
      })),
      campaign: {
        id: campaign.campaign_id,
        name: campaign.campaign_name,
        discount_rate: campaign.discount_rate,
      },
      amount: {
        total: order.amount.total,
        totalWithDiscount: order.amount.totalWithDiscount,
        discount: order.amount.discount,
        shippment: order.amount.shippment,
      },
      date: order.date,
    };
  }
}
