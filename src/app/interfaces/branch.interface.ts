import { Food } from './food.interface';
import { FoodCategory } from './foodCategory.interface';
import { Representative } from './representative.interface';
import { Review } from './review.interface';

export interface Branch {
  id: string;
  name: string;
  representative: Representative | null;
  phone: string;
  business_license: string;
  owner_nid: string;
  established_date: string;
  parentFranchiseId: string; // Links to parent franchise
  working_period: string;
  large_option: string;
  location: string;
  restaurant_image: string | null;
  restaurant_image_url: string | null;
  rating: string;
  status: 'Open' | 'Closed';
  categories: FoodCategory[];
  foods: Food[];
  reviews: Review[];
  riders: any[];
  isToolbarOpen?: boolean;
  checked?: boolean;
}
