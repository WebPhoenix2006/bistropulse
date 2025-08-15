export interface Location {
  lat: number;
  lng: number;
}

export interface OrderItem {
  food: number; // Food ID or reference
  quantity: number; // Quantity ordered
  unit_price: string; // Price per unit as string (could use number if backend supports it)
}

export interface OrderSubmitInterface {
  customer_code: string;
  rider_code: string;
  restaurant_code: string;
  pickup_location: Location;
  dropoff_location: Location;
  current_location: Location;
  status: 'Placed' | 'on the way' | 'Delivered' | 'Cancelled'; // Possible statuses
  date_ordered: string; // ISO date string (YYYY-MM-DD)
  date_delivered: string | null;
  payment_method: 'Cash in hand' | 'Card' | 'Online' | string;
  payment_status: 'Pending' | 'Paid' | 'Failed' | string;
  delivery_fee: string; // Could be number if needed
  platform_fee: string;
  tax: string;
  total: string;
  items: OrderItem[];
}
