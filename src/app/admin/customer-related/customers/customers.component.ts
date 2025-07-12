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
  filteredList: any[] = [];

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

  ngOnInit(): void {
    const token = localStorage.getItem('auth_token');
    if (token) {
      this.loadCustomers();
    }
  }

  loadCustomers(): void {
    this.isLoading = true;
    this.slowNetwork.start(() => {
      if (this.isLoading) {
        this.toastr.warning('Hmm... slow network');
      }
    });

    this.customerService.getCustomers().subscribe({
      next: (res: any) => {
        this.customers =
          res.results.map((c: any) => ({ ...c, checked: false })) || [];
        this.applyFilters();
        this.totalCount = this.filteredList.length;
        this.isLoading = false;
        this.slowNetwork.clear();
      },
      error: (err) => {
        this.toastr.error('❌ Failed to fetch customers');
        this.customers = [];
        this.filteredList = [];
        this.totalCount = 0;
        this.isLoading = false;
        this.slowNetwork.clear();
      },
    });
  }

  applyFilters(): void {
    const filtered = this.filterPipe.transform(
      this.customers,
      this.searchTerm,
      'name'
    );
    this.totalCount = filtered.length;
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.filteredList = filtered.slice(startIndex, endIndex);
  }

  get filteredCustomers(): any[] {
    return this.filteredList;
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.applyFilters();
  }

  toggleDropdown(index: number): void {
    this.openDropdownIndex = this.openDropdownIndex === index ? null : index;
  }

  isToolbarOpen(index: number): boolean {
    return this.openDropdownIndex === index;
  }

  toggleSelection(index: number): void {
    this.filteredList[index].checked = !this.filteredList[index].checked;
  }

  allSelected(): boolean {
    return this.filteredList.every((c) => c.checked);
  }

  toggleSelectAll(): void {
    const newState = !this.allSelected();
    this.filteredList.forEach((c) => (c.checked = newState));
  }

  get totalPages(): number {
    return Math.ceil(this.totalCount / this.itemsPerPage);
  }
}
