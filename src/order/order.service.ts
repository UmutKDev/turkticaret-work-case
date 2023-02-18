import { Injectable, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from 'schemas/order.schema';
import { Campaign } from 'schemas/campaign.schema';
import { Product } from 'schemas/product.schema';
import { Category } from 'schemas/category.schema';
import type { FindOrderResponse } from 'src/order/interfaces/FindOrderResponse';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel,
    @InjectModel(Campaign.name) private campaignModel,
    @InjectModel(Product.name) private productModel,
    @InjectModel(Category.name) private categoryModel,
  ) {}

  async createOrder({ products, campaign_id }): Promise<Order> {
    // first check stock if there is enough stock for the order

    const productIds = products.map((product) => product.id);
    const productQuantities = products.map((product) => product.quantity);
    const productStocks = await this.productModel
      .find({ product_id: { $in: productIds } })
      .select('stock_quantity product_id -_id list_price')
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
        `Product IDs: ${notAvailableProduct.product_id} is not available`,
        400,
      );
    }

    // if total price is more than 150 TL, apply 35 TL shippment discount
    const totalPrice = productStocks.reduce(
      (total, productStock, index) =>
        total + productStock.list_price * productQuantities[index],
      0,
    );

    const isShippmentDiscountAvailable = totalPrice > 150;

    // check campaign category_title, author_name and max_product_count in product_ids array if is valid for campaign discount
    const campaign = await this.campaignModel.findOne({ campaign_id }).lean();

    if (campaign) {
      const { category_title, author_name, max_product_count } = campaign;

      const category = await this.categoryModel.findOne({
        category_title,
      });

      const categoryProducts = await this.productModel.find({
        category_id: category.category_id,
      });

      const categoryProductIds = categoryProducts.map(
        (categoryProduct) => categoryProduct.product_id,
      );

      const isCategoryProductAvailable = productIds.every((productId) =>
        categoryProductIds.includes(productId),
      );

      if (!isCategoryProductAvailable) {
        throw new HttpException(
          `Category Product IDs: ${productIds} is not available for campaign`,
          400,
        );
      }

      const authorProducts = await this.productModel.find({
        author: author_name,
      });

      const authorProductIds = authorProducts.map(
        (authorProduct) => authorProduct.product_id,
      );

      const isAuthorProductAvailable = productIds.every((productId) =>
        authorProductIds.includes(productId),
      );

      if (!isAuthorProductAvailable) {
        throw new HttpException(
          `Author Product IDs: ${productIds} is not available for campaign`,
          400,
        );
      }

      const totalProductCount = products.reduce(
        (total, product) => total + product.quantity,
        0,
      );

      const isMaxProductCountAvailable = totalProductCount <= max_product_count;

      if (!isMaxProductCountAvailable) {
        throw new HttpException(
          `Product Count Product IDs: ${productIds} is not available for campaign`,
          400,
        );
      }
    }

    const totalCost = campaign
      ? totalPrice * campaign.discount_rate
      : totalPrice;

    const order = await this.orderModel.create({
      products: productStocks.map((productStock) => productStock.product_id),
      campaign_id: campaign ? campaign.campaign_id : null,
      amount: {
        total: totalPrice,
        totalWithDiscount: totalCost,
        discount: campaign ? campaign.discount_rate : 0,
        shippment: isShippmentDiscountAvailable ? 0 : 35,
      },
    });

    return order;
  }

  async getOrderOne({ order_id }): Promise<FindOrderResponse> {
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
      .findOne({
        category_id: campaign.category_id,
      })
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
        max_product_count: campaign.max_product_count,
        author_name: campaign.author_name,
        category_title: category.title,
      },
      amount: order.amount,
    };
  }
}
