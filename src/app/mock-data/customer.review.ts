import { CustomerReview } from '../interfaces/customer-review.interface';

export const MOCK_CUSTOMER_REVIEWS: CustomerReview[] = [
  {
    orderId: '#B001350',
    restaurantName: 'Star Valley Restaurant',
    customerId: 101,
    reviewedItems: [
      {
        itemName: 'Beef onion pizza',
        comment: 'The Beef onion pizza is one of the best dish of Star vally',
        imageUrl: 'assets/images/restaurant-img.png',
      },
      {
        itemName: 'Cheese pizza',
        comment: '',
        imageUrl: 'assets/images/restaurant-picture.jpeg',
      },
    ],
    rating: 4,
    reviewedAt: '2023-11-28T20:30:00',
    replys: [],
  },
  {
    orderId: '#B001465',
    restaurantName: 'The Cafe Rio',
    customerId: 102,
    reviewedItems: [
      {
        itemName: 'Beef onion pizza',
        comment: 'The Beef onion pizza is one of the best dish of Star vally',
        imageUrl: 'assets/images/restaurant-img.png',
      },
    ],
    rating: 5,
    reviewedAt: '2023-11-28T20:30:00',
    replys: [
      {
        text: 'Thank you sir.',
        repliedBy: 'Admin',
        repliedAt: '2023-11-28T20:30:00',
      },
    ],
  },
];
