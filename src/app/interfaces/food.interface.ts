export interface Food {
  categoryId: string;
  id: string;
  name: string;
  price: number;
  image?: File | string;
  description?: string;
  categoryName?: string;
  status?: 'Active' | 'Deactive';
  isToolbarOpen?: boolean;
  checked?: boolean;
  sizes?: {
    smallPrice?: string;
    mediumPrice?: string;
    largePrice?: string;
  };
}
