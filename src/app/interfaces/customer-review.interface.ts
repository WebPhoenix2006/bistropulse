export interface CustomerReview {
  orderId: string;
  restaurantName: string;
  customerId: number;
  reviewedItems: {
    itemName: string;
    comment?: string;
    imageUrl: string;
  }[];
  rating: number; // 1 to 5
  reviewedAt: string; // ISO date
  replys?: CustomerReviewReply[];
}

interface CustomerReviewReply {
  text: string;
  repliedBy: string; // admin/restaurant name
  repliedAt: string; // ISO date
}
