import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  HostListener,
  inject,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Franchise } from '../../../interfaces/franchise.interface';
import { FilterByPipe } from '../../../shared/pipes/filter.pipe';
import { BootstrapToastService } from '../../../shared/services/bootstrap-toast.service';
import { FranchisesService } from '../../../shared/services/franchises.service';
import { RestaurantContextService } from '../../../shared/services/restaurant-context.service';
import { SlowNetworkService } from '../../../shared/services/slow-nerwork.service';

@Component({
  selector: 'app-branch-list',
  standalone: false,
  templateUrl: './branch-list.component.html',
  styleUrl: './branch-list.component.scss',
  providers: [FilterByPipe],
})
export class BranchListComponent {
  isFilterModalOpen = signal<boolean>(false);
  buttonText = signal<string>('Filter');
  searchTerm = signal<string>('');
  isLoading = signal<boolean>(false);

  franchises: Array<Franchise> = [];
  filteredList: Array<Franchise> = [];

  currentPage = 1;
  itemsPerPage = 10;
  totalCount = 0;

  // ============ SERVICES DECLARATIONS =======
  private franchisesService = inject(FranchisesService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toastr = inject(BootstrapToastService);
  private slowNetwork = inject(SlowNetworkService);
  private restaurantContext = inject(RestaurantContextService);
  private filterPipe = inject(FilterByPipe);
  private platformId = inject(PLATFORM_ID);

  branchId = signal<string>('');
  branches: Array<any> = [];

  getBranch(): void {
    this.franchisesService.getBranches(this.branchId()).subscribe({
      next: (data: any) => {
        this.franchises = data.results.map((branch: any) => ({
          ...branch,
          checked: false,
          isToolbarOpen: false,
        }));
        this.toastr.showSuccess('Franchises loaded successfully');
        this.isLoading.set(false);
        this.slowNetwork.clear();
      },
      error: (err) => {
        this.toastr.showError(err.message || 'Failed to fetch franchises');
        this.isLoading.set(false);
        this.slowNetwork.clear();
      },
    });
  }

  ngOnInit() {
    // Get the franchise ID from route first
    const id = this.route.snapshot.paramMap.get('franchiseId');

    if (id) {
      this.branchId.set(id);
      console.log('Set branchId to:', id); // Debug log
    } else {
      console.log('No franchiseId found in route params');
      this.toastr.showError('Invalid franchise ID in URL');
      return;
    }

    const isBrowser = isPlatformBrowser(this.platformId);
    if (isBrowser) {
      const token = localStorage.getItem('auth_token');
      if (token) {
        this.getBranch(); // Now called after branchId is set
      } else {
        this.toastr.showError('You are not authorized to view this page');
      }
    }

    // Clear any existing restaurant context when coming to franchise page
    const isFromFranchise = this.router.url.includes('/franchises/');
    if (!isFromFranchise) {
      this.restaurantContext.setRestaurantId(null);
    }

    this.applyFilters();
  }

  applyFilters(): void {
    const filtered = this.filterPipe.transform(
      this.franchises,
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

  get filteredFranchises(): any[] {
    return this.filteredList;
  }

  viewFranchiseBranches(franchiseId: string): void {
    // Navigate to branches page for this franchise
    this.router.navigate(['/admin/franchises', franchiseId, 'branches']);
  }

  editFranchise(id: number): void {
    this.router.navigate(['/admin/franchises', id, 'edit']);
  }

  deleteFranchise(id: number): void {
    // Implement delete functionality
    console.log('Delete franchise:', id);
    this.toastr.showWarning('Delete functionality coming soon!');
  }

  toggleFranchiseStatus(id: number): void {
    const franchise = this.franchises.find((f) => f.id === id);
    if (franchise) {
      franchise.status = franchise.status === 'Active' ? 'Inactive' : 'Active';
      this.toastr.showSuccess(`Franchise ${franchise.status.toLowerCase()}`);
    }
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
    this.filteredList.forEach((f) => (f.checked = newState));
  }

  allChecked(): boolean {
    return this.filteredList.every((f) => f.checked);
  }

  toggleVisibility(id: number): void {
    const currentOpenState = this.franchises.find(
      (f) => f.id === id
    )?.isToolbarOpen;

    this.franchises.forEach((f) => (f.isToolbarOpen = false));
    if (!currentOpenState) {
      const match = this.franchises.find((f) => f.id === id);
      if (match) match.isToolbarOpen = true;
    }
  }

  closeAll(): void {
    this.franchises.forEach((f) => (f.isToolbarOpen = false));
  }

  get totalPages(): number {
    return Math.ceil(this.totalCount / this.itemsPerPage);
  }
}
