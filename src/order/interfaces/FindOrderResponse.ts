export interface FindOrderResponse {
  order_id: string;
  products: [
    {
      id: number;
      title: string;
      list_price: DoubleRange;
      stock_quantity: number;
    },
  ];
  campaign: {
    id: number;
    name: string;
    discount_rate: DoubleRange;
    max_product_count: number;
    author_name: string;
    category_title: string;
  };
  amount: {
    total: DoubleRange;
    totalWithDiscount: DoubleRange;
    discount: DoubleRange;
    shippment: DoubleRange;
  };
}
