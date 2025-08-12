export interface RiderRequestInterface {
  id: number;
  rider_code: string;
  full_name: string;
  phone: string;
  profile_image: string | null;
  profile_image_url: string | null;
  date_of_birth: string; // could also use Date if you parse it
  gender: 'Male' | 'Female' | string; // if backend allows only these, keep union
  address: string;
  restaurant: string;
  is_active: boolean;
  orders: any[];
}
