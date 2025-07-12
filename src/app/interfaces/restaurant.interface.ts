import { Food } from './food.interface';
import { FoodCategory } from './foodCategory.interface';
import { Representative } from './representative.interface';
import { Review } from './review.interface';

export interface Restaurant {
  id: string;
  name: string;
  representative: Representative | null;
  phone: string;
  business_license: string;
  owner_nid: string;
  established_date: string;
  working_period: string;
  large_option: string;
  location: string;
  restaurant_image: string | null;
  restaurant_image_url: string | null;
  rating: string;
  status: 'Open' | 'Closed'; // Add more if needed
  categories: FoodCategory[];
  foods: Food[];
  reviews: Review[];
  riders: any[];
  isToolbarOpen?: boolean;
  checked?: boolean;
}
