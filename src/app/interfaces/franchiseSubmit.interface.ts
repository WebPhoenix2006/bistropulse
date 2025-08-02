export interface FranchiseSubmit {
  name: string;
  phone: string;
  business_license: File | null;
  owner_nid: string | null;
  established_date: string; // ISO string or 'YYYY-MM-DD'
  working_period: string;
  large_option: string;
  location: string;
  franchise_image: File | null;
  owner: {
    full_name: string;
    phone: string;
    location: string;
    representative_image: File | null;
  };
}
