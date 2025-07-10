import { Food } from './food.interface';
import { FoodCategory } from './foodCategory.interface';
import { Representative } from './representative.interface';
import { Review } from './review.interface';

export interface Restaurant {
  id: string;
  restaurantName: string;
  phone: string;
  representativeInfo: Representative;
  businessLicense: string;
  ownerNID: string;
  restaurantImage: string | File;
  location: string;
  ratings: number;
  reviews: Review[]; // You can change this to number if needed
  status: 'Open' | 'Closed'; // Extend this if there are more possible statuses
  workingPeriod: string;
  establishedDate: string; // Or Date if parsed
  largeOption: string;
  checked: boolean;
  isToolbarOpen: boolean;
  categories?: FoodCategory[]; // New
  foods?: Food[];
}
