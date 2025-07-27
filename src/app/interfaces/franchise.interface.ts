import { Representative } from './representative.interface';

export interface Franchise {
  id: string;
  name: string;
  owner: Representative;
  phone: string;
  business_license: string;
  owner_nid: string;
  established_date: string;
  totalBranches: number;
  branchIds: string[];
  franchise_image: string | null;
  franchise_image_url: string | null;
  overall_rating: string;
  status: 'Active' | 'Inactive';
  created_at: string;
  updated_at: string;
  isToolbarOpen?: boolean;
  checked?: boolean;
}
