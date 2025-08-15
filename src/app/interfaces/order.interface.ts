// interfaces/order.interface.ts

export interface Location {
  lat: number;
  lng: number;
}

export interface Customer {
  id: number;
  customer_id: string;
  name: string;
  email: string;
  phone: string;
  is_student: boolean;
  gender: string;
  location: string;
  photo_url: string;
  created_at: string;
}

export interface Rider {
  rider_code: string;
  full_name: string;
  phone: string;
  profile_image: string;
  profile_image_url: string;
  date_of_birth: string;
  gender: string;
  address: string;
  restaurant: string;
  is_active: boolean;
}

export interface OrderItem {
  food: number;
  quantity: number;
  unit_price: string;
  // Optional fields that might be populated from food details
  food_name?: string;
  food_image?: string;
  food_description?: string;
}

export interface Order {
  order_id: string;
  rider: Rider;
  rider_code: string;
  customer: Customer;
  restaurant: string;
  branch?: string | null;
  pickup_location: Location;
  dropoff_location: Location;
  current_location: Location;
  status: string;
  date_ordered: string;
  date_delivered?: string | null;
  payment_method: string;
  payment_status: string;
  delivery_fee: string;
  platform_fee: string;
  tax: string;
  total: string;
  items?: OrderItem[];
}

// For creating orders
export interface CreateOrderRequest {
  customer_code: string;
  rider_code: string;
  restaurant_code: string;
  pickup_location: Location;
  dropoff_location: Location;
  current_location: Location;
  status: string;
  date_ordered: string;
  date_delivered?: string | null;
  payment_method: string;
  payment_status: string;
  delivery_fee: string;
  platform_fee: string;
  tax: string;
  total: string;
  items: OrderItem[];
}

// For updating orders
export interface UpdateOrderRequest {
  rider_code?: string;
  pickup_location?: Location;
  dropoff_location?: Location;
  current_location?: Location;
  status?: string;
  date_delivered?: string;
  payment_method?: string;
  payment_status?: string;
  delivery_fee?: string;
  platform_fee?: string;
  tax?: string;
  total?: string;
}

// Order status types
export type OrderStatus = 
  | 'Placed' 
  | 'Accepted' 
  | 'Being prepared' 
  | 'On the way' 
  | 'Delivered' 
  | 'Cancelled';

// Payment status types
export type PaymentStatus = 
  | 'Pending' 
  | 'Paid' 
  | 'Failed' 
  | 'Refunded';

// Payment method types
export type PaymentMethod = 
  | 'Cash in hand' 
  | 'Card' 
  | 'Mobile Money' 
  | 'Bank Transfer';

// WebSocket message types
export interface WebSocketMessage {
  type: 'order_update' | 'status_change' | 'location_update' | 'rider_assigned';
  data: Order;
  timestamp: string;
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

// Error response
export interface ApiError {
  success: false;
  message: string;
  errors?: { [key: string]: string[] };
}