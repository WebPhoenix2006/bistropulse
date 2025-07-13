import { Component, OnInit, signal } from '@angular/core';
import { RestaurantService } from '../../../shared/services/restaurant.service';
import { ActivatedRoute } from '@angular/router';
import { Restaurant } from '../../../interfaces/restaurant.interface';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-restaurant-overview',
  standalone: false,
  templateUrl: './restaurant-overview.component.html',
  styleUrl: './restaurant-overview.component.scss',
})
export class RestaurantOverviewComponent implements OnInit {
  constructor(
    private restaurantService: RestaurantService,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  isLoading = signal<boolean>(false);

  restaurant: Restaurant | null = null;

  restaurantId!: string;

  ngOnInit(): void {
    this.isLoading.set(true);
    this.restaurantId = this.route.snapshot.paramMap.get('id');
    this.restaurantService.getRestaurant(this.restaurantId).subscribe({
      next: (data: Restaurant) => {
        console.log('restaurant fetched: ', data);
        this.toastr.success('restaurant fetched!');
        this.isLoading.set(false);
        this.restaurant = data;
      },
      error: (err) => {
        console.error('FETCH ERROR', err);
        this.toastr.error('failed to fetch', '', { timeOut: 2000 });
        this.isLoading.set(false);
      },
    });
  }
}
