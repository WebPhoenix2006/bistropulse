import { Component, HostListener, inject, OnInit, signal } from '@angular/core';
import { RestaurantService } from '../../shared/services/restaurant.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-restaurant-list',
  standalone: false,
  templateUrl: './restaurant-list.component.html',
  styleUrl: './restaurant-list.component.scss',
})
export class RestaurantListComponent implements OnInit {
  isFilterModalOpen = signal<boolean>(false);
  restaurantService = inject(RestaurantService);

  constructor(private router: Router) {}

  goToOverview() {
    this.router.navigateByUrl('/admin/restaurant-overview');
  }

  toggleFilterModal(): void {
    this.isFilterModalOpen.set(!this.isFilterModalOpen());
    this.closeAll();
  }

  restaurants: Array<any> = [];

  getRestaurants(): void {
    this.restaurantService.getRestaurants().subscribe({
      next: (data: any) => {
        this.restaurants = data.results.map((dataObject: any) => ({
          ...dataObject,
          checked: false,
          isToolbarOpen: false,
        }));
        console.log(this.restaurants);
      },
      error: (err) => {
        console.warn('fecth failed: ' + err);
      },
    });
  }

  ngOnInit(): void {
    this.getRestaurants();
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

  toggleChecked(id: number): void {
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

  toggleVisibility(id: number): void {
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
