import { Representative } from './representative.interface';

export interface Franchise {
  id: number;
  franchise_id: string;
  name: string;
  phone: string;
  business_license: string; // URL to PDF
  owner_nid: string; // URL to PDF
  established_date: string; // e.g., "2010-03-15"
  franchise_image: string | null;
  overall_rating: string; // e.g., "0.0"
  status: 'Active' | 'Inactive';
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
  created_by: number;
  checked?: boolean;
  isToolbarOpen: boolean;
  location: string;

  owner: {
    id: number;
    full_name: string;
    phone: string;
    location: string;
    representative_image: string | null;
  };
}
