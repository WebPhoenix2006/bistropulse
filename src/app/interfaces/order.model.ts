export interface OrderTrackingDetails {
  order_id: string;
  customerName: string;
  status: 'Pending' | 'Accepted' | 'PickUp' | 'Dropoff' | 'Complete';
  paymentStatus: 'Paid' | 'Unpaid';
  courier: {
    name: string;
    phone: string;
    imageUrl?: string;
  };
  items: {
    name: string;
    quantity: number;
    price: number;
    imageUrl?: string;
  }[];
  pickupAddress: string;
  dropoffAddress: string;
  deliveryFee: number;
  subtotal: number;
  tax: number;
  total: number;
  tracking: {
    currentLocation: { lat: number; lng: number };
    route: { lat: number; lng: number }[];
  };
  timestamps: {
    pending: string;
    accepted?: string;
    pickup?: string;
    dropoff?: string;
    complete?: string;
  };
}
