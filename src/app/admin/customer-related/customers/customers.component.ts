import { Component, OnInit, inject } from '@angular/core';
import { CustomersService } from '../../../shared/services/customers.service';
import { FilterByPipe } from '../../../shared/pipes/filter.pipe';
import { ToastrService } from 'ngx-toastr';
import { SlowNetworkService } from '../../../shared/services/slow-nerwork.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss',
  standalone: false,
  providers: [FilterByPipe],
})
export class CustomersComponent implements OnInit {
  customerService = inject(CustomersService);
  searchTerm = '';
  customers: any[] = [];
  isLoading = false;

  currentPage = 1;
  itemsPerPage = 10;
  totalCount = 0;

  openDropdownIndex: number | null = null;

  constructor(
    private toastr: ToastrService,
    public slowNetwork: SlowNetworkService,
    private filterPipe: FilterByPipe
  ) {}

  get filteredCustomers(): any[] {
    return this.filterPipe.transform(this.customers, this.searchTerm, 'name');
  }

  ngOnInit(): void {
    const token = localStorage.getItem('auth_token');
    if (token) {
      this.loadCustomers();
    } else {
      console.warn(
        '❌ Token not found in localStorage. Skipping customer fetch.'
      );
    }
  }

  loadCustomers(page: number = 1) {
    this.isLoading = true;
    this.slowNetwork.start(() => {
      if (this.isLoading) {
        this.toastr.warning(
          'Hmm... this is taking longer than usual. Please check your connection.',
          'Slow Network'
        );
      }
    });

    this.customerService.getCustomers(page).subscribe({
      next: (res: any) => {
        this.customers =
          res.results?.map((c: any) => ({ ...c, checked: false })) || [];
        this.totalCount = res.count || 0;
        this.currentPage = page;
        this.isLoading = false;
        this.slowNetwork.clear();
      },
      error: (err) => {
        this.toastr.error('❌ Failed to fetch customers:', err);
        this.customers = [];
        this.totalCount = 0;
        this.isLoading = false;
        this.slowNetwork.clear();
      },
    });
  }

  onPageChange(page: number) {
    this.loadCustomers(page);
  }

  // ⬇️ Dropdown Logic
  toggleDropdown(index: number): void {
    this.openDropdownIndex = this.openDropdownIndex === index ? null : index;
  }

  isToolbarOpen(index: number): boolean {
    return this.openDropdownIndex === index;
  }

  // ⬇️ Checkbox Logic
  toggleSelection(index: number): void {
    this.filteredCustomers[index].checked =
      !this.filteredCustomers[index].checked;
  }

  allSelected(): boolean {
    return this.filteredCustomers.every((c) => c.checked);
  }

  toggleSelectAll(): void {
    const newState = !this.allSelected();
    this.filteredCustomers.forEach((c) => (c.checked = newState));
  }

  get totalPages(): number {
    return Math.ceil(this.totalCount / this.itemsPerPage);
  }
}
