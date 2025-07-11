import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RestaurantContextService } from '../../../shared/services/restaurant-context.service';

@Component({
  selector: 'app-food-details',
  standalone: false,
  templateUrl: './food-details.component.html',
  styleUrl: './food-details.component.scss',
})
export class FoodDetailsComponent {
  //   constructor(
  //     private router: Router,
  //     private restaurantContext: RestaurantContextService
  //   ) {}
  // selectRestaurant(id: string): void {
  //   this.restaurantContext.setRestaurantId(id);
  //   this.router.navigate(['/admin/restaurants', id]);
  // }
}
