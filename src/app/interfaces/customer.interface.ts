export interface Customer {
  id: number;
  customer_id: string;
  name: string;
  email: string;
  phone: string;
  is_student: boolean;
  gender: 'Male' | 'Female' | string;
  location: string;
  photo_url: string;
  created_at: string;
  checked: boolean;
}
