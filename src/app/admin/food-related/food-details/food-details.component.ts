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
    reviews: [],
  };

  ratingBreakdown = [
    { stars: 5, count: 0 },
    { stars: 4, count: 0 },
    { stars: 3, count: 0 },
    { stars: 2, count: 0 },
    { stars: 1, count: 0 },
  ];

  averageRating: number = 0;

  ngOnInit(): void {}
}
