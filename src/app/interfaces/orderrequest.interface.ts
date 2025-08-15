// order-request.interface.ts
import { CustomerInterface } from './customer.interface';

export interface Location {
  lat: number;
  lng: number;
}

export interface Rider {
  rider_code: string;
  full_name: string;
  phone: string;
  profile_image: string;
  profile_image_url: string;
  date_of_birth: string; // YYYY-MM-DD
  gender: string;
  address: string;
  restaurant: string;
  is_active: boolean;
}

/**
 * Your in-app model (with numeric fees)
 */
export interface OrderRequest {
  order_id: string;
  rider: Rider;
  customer: CustomerInterface;
  restaurant: string;
  branch: string | null;
  pickup_location: Location;
  dropoff_location: Location;
  current_location: Location;
  status: 'Placed' | 'In Transit' | 'Delivered' | 'Cancelled' | string;
  date_ordered: string; // keep as string if you’re not parsing Dates
  date_delivered: string | null;
  payment_method: 'Cash in hand' | 'Card' | 'Online' | string;
  payment_status: 'Pending' | 'Paid' | 'Failed' | string;

  // numeric now ✅
  delivery_fee: number;
  platform_fee: number;
  tax: number;
  total: number;
}

/**
 * Shape that matches the API response exactly (fees as strings)
 */
export type OrderRequestApi = Omit<
  OrderRequest,
  'delivery_fee' | 'platform_fee' | 'tax' | 'total'
> & {
  delivery_fee: string;
  platform_fee: string;
  tax: string;
  total: string;
};

/** Safe number parser (handles null/empty/invalid) */
const toNumber = (v: unknown): number => {
  if (v === null || v === undefined || v === '') return 0;
  const n = Number(v);
  return Number.isNaN(n) ? 0 : n;
};

/** Mapper: API ➜ app model (converts fees to numbers) */
export function mapOrderRequest(api: OrderRequestApi): OrderRequest {
  return {
    ...api,
    delivery_fee: toNumber(api.delivery_fee),
    platform_fee: toNumber(api.platform_fee),
    tax: toNumber(api.tax),
    total: toNumber(api.total),
  };
}
