import { Food } from './food.interface';
import { FoodCategory } from './foodCategory.interface';

export interface Restaurant {
  id: string;
  name: string;
  representative: string;
  phone: string;
  business_license: string;
  owner_nid: string;
  restaurant_image_url: string;
  location: string;
  rating: string; // You can change this to number if needed
  status: 'Open' | 'Closed'; // Extend this if there are more possible statuses
  working_period: string;
  established_date: string; // Or Date if parsed
  large_option: string;
  checked: boolean;
  isToolbarOpen: boolean;
  categories?: FoodCategory[]; // New
  foods?: Food[];
}
