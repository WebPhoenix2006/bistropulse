import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  HostListener,
  inject,
  OnInit,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Branch } from '../../../interfaces/branch.interface'; // Update import path as needed
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
export class BranchListComponent implements OnInit {
  isFilterModalOpen = signal<boolean>(false);
  buttonText = signal<string>('Filter');
  searchTerm = signal<string>('');
  isLoading = signal<boolean>(false);

  branches: Array<Branch> = [];
  filteredList: Array<Branch> = [];

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

  franchiseId = signal<string>('');

  getBranches(): void {
    this.isLoading.set(true);
    this.slowNetwork.start(() => {
      if (this.isLoading()) {
        this.toastr.showWarning('Hmm this is taking longer than expected');
      }
    });

    this.franchisesService.getBranches(this.franchiseId()).subscribe({
      next: (data: any) => {
        this.branches = data.results.map((branch: any) => ({
          ...branch,
          checked: false,
          isToolbarOpen: false,
        }));
        this.toastr.showSuccess('Branches loaded successfully');
        this.isLoading.set(false);
        console.log(this.branches);
        this.slowNetwork.clear();
        this.applyFilters();
      },
      error: (err) => {
        this.toastr.showError(err.message || 'Failed to fetch branches');
        this.isLoading.set(false);
        this.slowNetwork.clear();
      },
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('franchiseId');

    if (id) {
      this.franchiseId.set(id);
    } else {
      this.toastr.showError('Invalid franchise ID in URL');
      return;
    }

    const isBrowser = isPlatformBrowser(this.platformId);
    if (isBrowser) {
      const token = localStorage.getItem('auth_token');
      if (token) {
        this.getBranches();
      } else {
        this.toastr.showError('You are not authorized to view this page');
      }
    }

    // Clear any existing restaurant context when coming to franchise page
    const isFromFranchise = this.router.url.includes('/franchises/');
    if (!isFromFranchise) {
      this.restaurantContext.setRestaurantId(null);
    }
  }

  applyFilters(): void {
    const filtered = this.filterPipe.transform(
      this.branches,
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

  get filteredBranches(): Branch[] {
    return this.filteredList;
  }

  viewBranchDetails(branchId: string): void {
    // Navigate to branch details page
    this.router.navigate(['/admin/branches', branchId, 'details']);
  }

  viewBranchMenu(branchId: string): void {
    // Navigate to branch menu page
    this.router.navigate(['/admin/branches', branchId, 'menu']);
  }

  editBranch(id: number): void {
    this.router.navigate(['/admin/branches', id, 'edit']);
  }

  deleteBranch(id: number): void {
    // Implement delete functionality
    console.log('Delete branch:', id);
    this.toastr.showWarning('Delete functionality coming soon!');
  }

  toggleBranchStatus(id: number): void {
    const branch = this.branches.find((b) => b.id === id);
    if (branch) {
      branch.status = branch.status === 'Open' ? 'Closed' : 'Open';
      this.toastr.showSuccess(`Branch ${branch.status.toLowerCase()}`);
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
    this.filteredList.forEach((b) => (b.checked = newState));
  }

  allChecked(): boolean {
    return this.filteredList.every((b) => b.checked);
  }

  toggleVisibility(id: number): void {
    const currentOpenState = this.branches.find(
      (b) => b.id === id
    )?.isToolbarOpen;

    this.branches.forEach((b) => (b.isToolbarOpen = false));
    if (!currentOpenState) {
      const match = this.branches.find((b) => b.id === id);
      if (match) match.isToolbarOpen = true;
    }
  }

  closeAll(): void {
    this.branches.forEach((b) => (b.isToolbarOpen = false));
  }

  get totalPages(): number {
    return Math.ceil(this.totalCount / this.itemsPerPage);
  }
}
