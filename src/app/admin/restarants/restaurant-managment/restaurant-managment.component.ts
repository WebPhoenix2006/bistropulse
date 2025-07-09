import {
  Component,
  computed,
  effect,
  HostListener,
  inject,
  OnInit,
  signal,
} from '@angular/core';
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
  restaurantService = inject(RestaurantService);
  buttonText = signal<string>('Filter');
  searchTerm = signal<string>('');
  isLoading = signal<boolean>(false);

  constructor(
    private router: Router,
    private toastr: ToastrService,
    public slowNetwork: SlowNetworkService,
    private restaurantContext: RestaurantContextService,
    private filterPipe: FilterByPipe
  ) {}

  selectRestaurant(id: string): void {
    this.restaurantContext.setRestaurantId(id);
    this.router.navigate(['/admin/restaurants', id]);
  }

  toggleFilterModal(): void {
    this.isFilterModalOpen.set(!this.isFilterModalOpen());
    this.closeAll();
  }

  restaurants: Array<Restaurant> = [];

  getRestaurants(): void {
    this.isLoading.set(true);
    this.slowNetwork.start(() => {
      if (this.isLoading) {
        this.toastr.warning(
          'Hmm... this is taking longer than usual. Please check your connection.',
          'Slow Network'
        );
      }
    });

    this.restaurantService.getRestaurants().subscribe({
      next: (data: any) => {
        this.restaurants = data.results.map((dataObject: any) => ({
          ...dataObject,
          checked: false,
          isToolbarOpen: false,
        }));
        this.isLoading.set(false);
        this.toastr.success('Loaded successfully', 'Success', {
          timeOut: 1200,
        });
        this.slowNetwork.clear();
      },
      error: (err) => {
        console.error('FETCH ERROR:', err);
        this.isLoading.set(false);
        this.slowNetwork.clear();
      },
    });
  }

  filteredRestaurants: any = computed(() =>
    this.filterPipe.transform(this.restaurants, this.searchTerm(), 'name')
  );

  ngOnInit() {
    this.getRestaurants();

    const isFromRestaurant = this.router.url.includes('/restaurants/');
    if (!isFromRestaurant) {
      this.restaurantContext.setRestaurantId(null);
    }
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
