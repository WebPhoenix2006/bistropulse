export interface BranchSubmit {
  branchName: string;
  branchNumber: string | number;
  businessLicense?: File;
  ownerNID?: File;
  establishedDate: string;
  workingPeriod: string;
  largeOption: string;
  location: string;
  branchImage?: File;
  franchise: number; // The franchise ID this branch belongs to
  representativeInfo: {
    full_name: string;
    phone: string | number;
    location: string;
    representative_image?: File;
  };
}
