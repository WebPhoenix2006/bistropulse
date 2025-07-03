import { Component, HostListener, inject, OnInit, signal } from '@angular/core';
import { RestaurantService } from '../../shared/services/restaurant.service';
import { Router } from '@angular/router';
import { Restaurant } from '../../interfaces/restaurant.interface';

@Component({
  selector: 'app-restaurant-list',
  standalone: false,
  templateUrl: './restaurant-list.component.html',
  styleUrl: './restaurant-list.component.scss',
})
export class RestaurantListComponent implements OnInit {
  isFilterModalOpen = signal<boolean>(false);
  restaurantService = inject(RestaurantService);
  buttonText = signal<string>('Filter');
  searchTerm = signal<string>('');
  isLoading = signal<boolean>(false);

  constructor(private router: Router) {}

  goToOverview() {
    this.router.navigateByUrl('/admin/restaurant-overview');
  }

  toggleFilterModal(): void {
    this.isFilterModalOpen.set(!this.isFilterModalOpen());
    this.closeAll();
  }

  restaurants: Array<Restaurant> = [];

  getRestaurants(): void {
    this.isLoading.set(true);
    this.restaurantService.getRestaurants().subscribe({
      next: (data: any) => {
        console.log(data);
        this.restaurants = data.map((dataObject: any) => ({
          ...dataObject,
          checked: false,
          isToolbarOpen: false,
        }));
        this.isLoading.set(false);
        console.log(this.restaurants);
      },
      error: (err) => {
        console.warn('fecth failed: ' + err);
        this.isLoading.set(false);
      },
    });
  }

  ngOnInit() {
    this.isLoading.set(true);

    this.restaurantService.getRestaurants().subscribe({
      next: (data: any) => {
        this.restaurants = data.map((dataObject: any) => ({
          ...dataObject,
          checked: false,
          isToolbarOpen: false,
        }));
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
      },
    });
  }

  @HostListener('document:click', ['$event'])
  handleDocumentClick(event: MouseEvent) {
    const clickedElement = event.target as HTMLElement;

    const isInsideToolbar = clickedElement.closest('.toolbar') !== null;
    const isToolbarToggle = clickedElement.closest('.toolbar-toggle') !== null;
    const isInsideFilter = clickedElement.closest('#filter-modal') !== null;
    const isFilterButton =
      clickedElement.closest('#filter-modal-button') !== null;

    if (!isInsideToolbar && !isToolbarToggle) {
      this.closeAll();
    }

    if (!isInsideFilter && !isFilterButton) {
      this.isFilterModalOpen.set(false);
    }
  }

  toggleChecked(id: string): void {
    this.restaurants = this.restaurants.map((restaurant) => {
      if (restaurant.id === id) {
        return {
          ...restaurant,
          checked: !restaurant.checked,
        };
      }
      return restaurant;
    });
  }

  checkAll(): void {
    this.restaurants = this.restaurants.map((restaurant) => {
      return {
        ...restaurant,
        checked: !restaurant.checked,
      };
    });
  }

  toggleVisibility(id: string): void {
    const currentOpenState = this.restaurants.find(
      (r) => r.id === id
    )?.isToolbarOpen;

    this.restaurants = this.restaurants.map((restaurant) => {
      return {
        ...restaurant,
        isToolbarOpen: false, // close all first
      };
    });

    // If it was closed before, open it now (after all are closed)
    if (!currentOpenState) {
      this.restaurants = this.restaurants.map((restaurant) => {
        if (restaurant.id === id) {
          return {
            ...restaurant,
            isToolbarOpen: true,
          };
        }
        return restaurant;
      });
    }
  }

  closeAll(): void {
    this.restaurants = this.restaurants.map((restaurant) => {
      return {
        ...restaurant,
        isToolbarOpen: false,
      };
    });
  }
}
