import { FoodCategory } from './foodCategory.interface';
import { Food } from './food.interface';
import { Representative } from './representative.interface';
import { Review } from './review.interface';

export interface Branch {
  id: number; // API returns number, not string
  branch_id: string; // Unique branch identifier like "BFb0001"
  name: string;
  representative: Representative | null; // API uses "representative", not "representative"
  phone: string;
  business_license: string | null; // API can return null
  owner_nid: string | null; // API can return null
  established_date: string;
  working_period: string;
  large_option: string;
  location: string;
  restaurant_image: string | null;
  rating: string; // API calls it "rating", not "restaurant_image_url"
  status: 'Open' | 'Closed';
  franchise: number; // References the parent franchise ID
  created_by: number; // User who created this branch

  // These would be populated when you fetch detailed branch data
  categories?: FoodCategory[]; // Optional - fetched separately
  foods?: Food[]; // Optional - fetched separately
  reviews?: Review[]; // Optional - fetched separately
  riders?: any[]; // Optional - fetched separately

  // Frontend-only properties
  isToolbarOpen?: boolean;
  checked?: boolean;
}
