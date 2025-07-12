export interface submitRepresentative {
  representativeImage: File | string;
  representativeNumber: number;
  representativeLocation: string;
  representativeName: string;
}

export interface Representative {
  id: number;
  full_name: string;
  photo: string | null;
  photo_url: string | null;
  phone: string;
  location: string;
}
