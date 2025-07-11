import {
  Component,
  HostListener,
  inject,
  OnInit,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RestaurantService } from '../../../shared/services/restaurant.service';
import { Router } from '@angular/router';
import { Restaurant } from '../../../interfaces/restaurant.interface';
import { ToastrService } from 'ngx-toastr';
import { SlowNetworkService } from '../../../shared/services/slow-nerwork.service';
import { RestaurantContextService } from '../../../shared/services/restaurant-context.service';
import { FilterByPipe } from '../../../shared/pipes/filter.pipe';

@Component({
  selector: 'app-restaurant-list',
  standalone: false,
  templateUrl: './restaurant-list.component.html',
  styleUrl: './restaurant-list.component.scss',
  providers: [FilterByPipe],
})
export class RestaurantListComponent implements OnInit {
  isFilterModalOpen = signal<boolean>(false);
  buttonText = signal<string>('Filter');
  searchTerm = signal<string>('');
  isLoading = signal<boolean>(false);
  restaurants: Array<Restaurant> = [];

  private restaurantService = inject(RestaurantService);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private slowNetwork = inject(SlowNetworkService);
  private restaurantContext = inject(RestaurantContextService);
  private filterPipe = inject(FilterByPipe);
  private platformId = inject(PLATFORM_ID);

  ngOnInit() {
    const isBrowser = isPlatformBrowser(this.platformId);
    if (isBrowser) {
      const token = localStorage.getItem('auth_token');
      if (token) {
        this.getRestaurants();
      } else {
        console.warn('No token found in localStorage');
      }
    }

    const isFromRestaurant = this.router.url.includes('/restaurants/');
    if (!isFromRestaurant) {
      this.restaurantContext.setRestaurantId(null);
    }
  }

  getRestaurants(): void {
    this.isLoading.set(true);

    this.slowNetwork.start(() => {
      if (this.isLoading()) {
        this.toastr.warning(
          'Hmm... this is taking longer than usual. Please check your connection.',
          'Slow Network'
        );
      }
    });

    this.restaurantService.getRestaurants().subscribe({
      next: (data: any) => {
        this.restaurants = data.results.map((restaurant: any) => ({
          ...restaurant,
          checked: false,
          isToolbarOpen: false,
        }));

        this.toastr.success('Loaded successfully', 'Success', {
          timeOut: 1200,
        });
        this.isLoading.set(false);
        this.slowNetwork.clear();
      },
      error: (err) => {
        console.error('FETCH ERROR:', err);
        this.toastr.error('Failed to fetch restaurants');
        this.isLoading.set(false);
        this.slowNetwork.clear();
      },
    });
  }

  get filteredRestaurants(): any[] {
    return this.filterPipe.transform(
      this.restaurants,
      this.searchTerm(),
      'restaurantName'
    );
  }

  selectRestaurant(id: string): void {
    this.restaurantContext.setRestaurantId(id);
    this.router.navigate(['/admin/restaurants', id]);
  }

  toggleFilterModal(): void {
    this.isFilterModalOpen.set(!this.isFilterModalOpen());
    this.closeAll();
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

  toggleSelection(index: number): void {
    this.filteredRestaurants[index].checked =
      !this.filteredRestaurants[index].checked;
  }

  toggleSelectAll(): void {
    const newState = !this.allChecked();
    this.filteredRestaurants.forEach((r) => (r.checked = newState));
  }

  allChecked(): boolean {
    return this.filteredRestaurants.every((r) => r.checked);
  }

  toggleVisibility(id: string): void {
    const currentOpenState = this.restaurants.find(
      (r) => r.id === id
    )?.isToolbarOpen;

    this.restaurants = this.restaurants.map((restaurant) => ({
      ...restaurant,
      isToolbarOpen: false,
    }));

    if (!currentOpenState) {
      this.restaurants = this.restaurants.map((restaurant) => {
        if (restaurant.id === id) {
          return { ...restaurant, isToolbarOpen: true };
        }
        return restaurant;
      });
    }
  }

  closeAll(): void {
    this.restaurants = this.restaurants.map((restaurant) => ({
      ...restaurant,
      isToolbarOpen: false,
    }));
  }

  editRestaurant(id: string) {
    // Edit logic here
  }

  deleteRestaurant(id: string) {
    // Delete logic here
  }
}
