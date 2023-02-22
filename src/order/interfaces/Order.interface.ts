export interface OrderResponse {
  order_id: string;
  products: Product[];
  campaign: Campaign;
  amount: {
    total: number;
    totalWithDiscount: number;
    discount: number;
    shippment: number;
  };
  date: {
    created: Date;
    updated: Date;
  };
}

type Product = {
  id: number;
  title: string;
  list_price: number;
  stock_quantity: number;
};

type Campaign = {
  id: number;
  name: string;
  discount_rate: number;
};
