import { Representative } from './representative.interface';

export interface Franchise {
  id: number;                    // API returns number
  franchise_id: string;          // API has this field
  name: string;
  owner: Representative;         // API calls this "owner"
  phone: string;
  business_license: string;
  owner_nid: string;
  established_date: string;
  franchise_image: string | null;
  overall_rating: string;
  status: 'Active' | 'Inactive';
  created_at: string;
  updated_at: string;
  created_by: number | null;     // API has this
  // Frontend-only properties
  totalBranches?: number;        // Calculate from separate API call
  branchIds?: string[];          // Calculate from separate API call
  isToolbarOpen?: boolean;
  checked?: boolean;
}