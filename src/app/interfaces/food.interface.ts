import { Review } from './review.interface';

export interface Food {
  id: string;
  name: string;
  categoryId: string;
  description?: string;
  image?: string | File;
  available?: boolean;
  price: number;
  sizes?: {
    smallPrice: number;
    mediumPrice: number;
    largePrice: number;
  };
  categoryName?: string;
  isToolbarOpen?: boolean;
  checked?: boolean;
  averageRating?: number; // calculated on backend
  totalRatings?: number; // how many ratings
  reviews?: Review[]; // full review objects
}
