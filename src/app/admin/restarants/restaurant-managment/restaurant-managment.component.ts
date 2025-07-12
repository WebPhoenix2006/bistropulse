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
// ... your imports remain the same

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
  filteredList: Array<Restaurant> = [];

  currentPage = 1;
  itemsPerPage = 10;
  totalCount = 0;

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
      if (token) this.getRestaurants();
      else this.toastr.error('You are not authorized to view this page');
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
        this.toastr.warning('Hmm... this is taking longer than usual.');
      }
    });

    this.restaurantService.getRestaurants().subscribe({
      next: (data: any) => {
        this.restaurants = data.results.map((restaurant: any) => ({
          ...restaurant,
          checked: false,
          isToolbarOpen: false,
        }));
        this.applyFilters();
        this.toastr.success('Loaded successfully');
        this.isLoading.set(false);
        this.slowNetwork.clear();
      },
      error: (err) => {
        this.toastr.error('Failed to fetch restaurants');
        this.isLoading.set(false);
        this.slowNetwork.clear();
      },
    });
  }

  applyFilters(): void {
    const filtered = this.filterPipe.transform(
      this.restaurants,
      this.searchTerm(),
      'name'
    );
    this.totalCount = filtered.length;
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.filteredList = filtered.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.applyFilters();
  }

  get filteredRestaurants(): any[] {
    return this.filteredList;
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
    this.filteredList[index].checked = !this.filteredList[index].checked;
  }

  toggleSelectAll(): void {
    const newState = !this.allChecked();
    this.filteredList.forEach((r) => (r.checked = newState));
  }

  allChecked(): boolean {
    return this.filteredList.every((r) => r.checked);
  }

  toggleVisibility(id: string): void {
    const currentOpenState = this.restaurants.find(
      (r) => r.id === id
    )?.isToolbarOpen;

    this.restaurants.forEach((r) => (r.isToolbarOpen = false));
    if (!currentOpenState) {
      const match = this.restaurants.find((r) => r.id === id);
      if (match) match.isToolbarOpen = true;
    }
  }

  closeAll(): void {
    this.restaurants.forEach((r) => (r.isToolbarOpen = false));
  }

  get totalPages(): number {
    return Math.ceil(this.totalCount / this.itemsPerPage);
  }
}
