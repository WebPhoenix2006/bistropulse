export interface RestaurantSubmit {
  restaurantName: string;
  restaurantNumber?: string | number;
  businessLicense?: string | File | null;
  ownerNID?: string | File | null;
  establishedDate?: string;
  workingPeriod?: string;
  largeOption?: string;
  location?: string;
  restaurantImage?: string | File | null;
  representativeInfo: {
    representativeName?: string;
    representativeNumber?: string | number;
    representativeLocation?: string;
    representativeImage?: string | File | null;
  };
}
