import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RestaurantContextService } from '../../../shared/services/restaurant-context.service';

@Component({
  selector: 'app-food-details',
  standalone: false,
  templateUrl: './food-details.component.html',
  styleUrl: './food-details.component.scss',
})
export class FoodDetailsComponent implements OnInit {
  //   constructor(
  //     private router: Router,
  //     private restaurantContext: RestaurantContextService
  //   ) {}
  // selectRestaurant(id: string): void {
  //   this.restaurantContext.setRestaurantId(id);
  //   this.router.navigate(['/admin/restaurants', id]);
  // }

  food = {
    id: 3,
    name: 'Veggie Delight Burger',
    price: {
      small: 45.0,
      medium: 55.0,
      large: 65.0,
    },
    image_url: 'https://images.unsplash.com/photo-1550547660-d9450f859349',
    description:
      'Grilled veggie patty, lettuce, tomato, cheese, and creamy sauce.',
    available: true,
    ratings: [5, 5, 5, 5, 5],
    reviews: [
      {
        name: 'Ralph Edwards',
        rating: 5,
        comment: 'I’m very much happy. Food is good.',
        date: 'Fri, Nov 28 • 12:30 PM',
      },
      {
        name: 'Jenny Wilson',
        rating: 4,
        comment: 'Nice taste, but arrived a bit late.',
        date: 'Sat, Nov 29 • 11:00 AM',
      },
      {
        name: 'Devon Lane',
        rating: 5,
        comment: 'Excellent! Definitely ordering again.',
        date: 'Sun, Nov 30 • 2:15 PM',
      },
      {
        name: 'Leslie Alexander',
        rating: 3,
        comment: 'Average. Not bad but not great either.',
        date: 'Mon, Dec 1 • 5:00 PM',
      },
      // ...add more as needed
    ],
  };

  ratingBreakdown = [
    { stars: 5, count: 0 },
    { stars: 4, count: 0 },
    { stars: 3, count: 0 },
    { stars: 2, count: 0 },
    { stars: 1, count: 0 },
  ];

  Math = Math;

  averageRating: number = 0;
  totalRatings = this.food.ratings.length;

  ngOnInit(): void {
    const ratings = this.food.ratings; // Example: [5, 4, 4, 2, 1, 5, 5]

    // Count each star
    for (const r of ratings) {
      const item = this.ratingBreakdown.find((b) => b.stars === r);
      if (item) item.count++;
    }

    // Calculate average
    const total = ratings.length;
    const sum = ratings.reduce((a, b) => a + b, 0);
    this.averageRating = total ? sum / total : 0;
  }
}
