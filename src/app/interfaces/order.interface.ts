export interface OrderItem {
  food: string; // or use a more complex Food object if needed
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Order {
  id: string;
  status: 'Placed' | 'Pending' | 'Accepted' | 'Being Prepared' | 'On the way' | 'Delivered';
  date_ordered: string | null;
  date_delivered: string | null;
  restaurant: string; // or Restaurant object if you're nesting it
  branch?: string;     // optional, based on your model
  rider?: string;      // optional too
  customer?: string;   // optional too
  items: OrderItem[];
  delivery_fee: number;
  platform_fee: number;
  tax: number;
  total: number;
  payment_method: 'Credit Card' | 'Cash in hand' | 'Paypal' | 'Bank Transfer';
  payment_status: 'Pending' | 'Complete';
}
