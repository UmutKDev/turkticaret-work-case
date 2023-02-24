/* eslint-disable prettier/prettier */
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
    const campaigns = await this.campaignModel.find().lean();

    if (products.length === 0) {
      throw new HttpException('Product list is empty', 400);
    }

    const productIds = products.map((product) => ({
      id: product.id,
      quantity: product.quantity,
    }));
    const productItems = await this.productModel
      .find({ product_id: { $in: productIds.map((x) => x.id) } })
      .select(
        'stock_quantity product_id -_id list_price author_name category_id',
      )
      .lean();

    productIds.map((id) => {
      productItems
        .filter((f) => f.product_id === id.id)
        .map((w) => {
          if (w.stock_quantity >= id.quantity) {
            return true;
          } else {
            throw new HttpException(
              `Product IDs: ${w.product_id} is not available in stock`,
              400,
            );
          }
        });
    });

    let totalPrice = productItems.reduce(
      (total, productStock, index) =>
        total + productStock.list_price * productIds[index].quantity,
      0,
    );

    let discountPrice = 0;

    const campaignByAuthorCategory = productItems.filter((item) =>
      campaigns.some(
        (campaign) =>
          campaign.author_name === item.author_name &&
          item.category_id === campaign.category_id,
      ),
    );

    let campaignItemQuantity = 0;

    products.filter((f) =>
      productItems
        .filter(
          (pS) =>
            pS.product_id === f.id &&
            pS.author_name === campaignByAuthorCategory[0]?.author_name &&
            pS.category_id === campaignByAuthorCategory[0]?.category_id,
        )
        .map(() => (campaignItemQuantity += f.quantity)),
    );

    const authorCategoryCamp = campaigns.filter(
      (cF) =>
        cF.author_name === campaignByAuthorCategory[0]?.author_name &&
        cF.category_id === campaignByAuthorCategory[0]?.category_id,
    );
    const percentCamp = campaigns.filter(
      (cF) => cF.author_name.length === 0 && cF.category_id === -1,
    );

    let activeCamp = {} as any;

    const highestDiscountCamp = percentCamp.filter(
      (cF) =>
        cF.discount_rate ===
        Math.max(...percentCamp.map((o) => o.discount_rate)),
    );

    if (
      authorCategoryCamp[0] &&
      campaignItemQuantity >= authorCategoryCamp[0].min_product_count
    ) {
      productItems.map((item) => (totalPrice += item.list_price));
      const topPrice = Math.max(
        ...campaignByAuthorCategory.map((o) => o.list_price),
      );
      if (totalPrice > highestDiscountCamp[0].min_order_amount) {
        if (
          totalPrice - topPrice <
          totalPrice - (totalPrice / 100) * highestDiscountCamp[0].discount_rate
        ) {
          activeCamp = {
            id: authorCategoryCamp[0].campaign_id,
            name: authorCategoryCamp[0].campaign_name,
          };
          discountPrice = totalPrice - topPrice;
        } else {
          activeCamp = {
            id: highestDiscountCamp[0].campaign_id,
            name: highestDiscountCamp[0].campaign_name,
          };
          discountPrice =
            totalPrice -
            totalPrice / (100 * highestDiscountCamp[0].discount_rate);
        }
      } else {
        activeCamp = {
          id: authorCategoryCamp[0].campaign_id,
          name: authorCategoryCamp[0].campaign_name,
        };
        discountPrice = totalPrice - topPrice;
      }
    } else {
      productItems.map((item) => (totalPrice += item.list_price));
      if (Number(totalPrice) > highestDiscountCamp[0].min_order_amount) {
        activeCamp = {
          id: highestDiscountCamp[0].campaign_id,
          name: highestDiscountCamp[0].campaign_name,
        };
        discountPrice =
          totalPrice -
          totalPrice / (100 * highestDiscountCamp[0].discount_rate);
      } else {
        discountPrice = 0;
      }
    }

    const isShippmentDiscountAvailable = totalPrice > 150;

    const order = await this.orderModel.create({
      order_id: Math.floor(Math.random() * 1000000),
      products: productItems.map((productStock) => productStock.product_id),
      campaign_id: activeCamp ? activeCamp.id : null,
      amount: {
        total: totalPrice,
        totalWithDiscount: discountPrice,
        shippment: isShippmentDiscountAvailable ? 0 : 35,
      },
    });

    return {
      order_id: order.order_id,
      products: productItems.map((productStock) => ({
        id: productStock.product_id,
        title: productStock.title,
        list_price: productStock.list_price,
        stock_quantity: productStock.stock_quantity,
      })),
      campaign: {
        id: activeCamp ? activeCamp.id : null,
        name: activeCamp ? activeCamp.name : null,
      },
      amount: {
        total: order.amount.total,
        totalWithDiscount: order.amount.totalWithDiscount,
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

    const category = await this.categoryModel
      .find({ category_id: { $in: products.map((x) => x.category_id) } })
      .select('-_id, -__v')
      .lean();

    return {
      order_id: order.order_id,
      products: products.map((product) => ({
        id: product.product_id,
        title: product.title,
        category: category.find((x) => x.category_id === product.category_id)
          .title,
        list_price: product.list_price,
        stock_quantity: product.stock_quantity,
      })),
      campaign: {
        id: campaign ? campaign.campaign_id : null,
        name: campaign ? campaign.campaign_name : null,
      },
      amount: {
        total: order.amount.total,
        totalWithDiscount: order.amount.totalWithDiscount,
        shippment: order.amount.shippment,
      },
      date: order.date,
    };
  }
}
