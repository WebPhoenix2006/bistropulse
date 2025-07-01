import { Component, inject } from '@angular/core';
import { CustomersService } from '../../shared/services/customers.service';

@Component({
  selector: 'app-customers',
  standalone: false,
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss',
})
export class CustomersComponent {
  customerService = inject(CustomersService);

  customers: any[] = [];
  isLoading = false;
  selectAll: boolean = false;

  currentPage = 1;
  itemsPerPage = 10;
  totalCount = 0;

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        this.loadCustomers();
      } else {
        console.warn(
          '❌ Token not found in localStorage. Skipping customer fetch.'
        );
      }
    }
  }

  loadCustomers(page: number = 1) {
    this.isLoading = true;

    this.customerService.getCustomers(page).subscribe({
      next: (res: any) => {
        this.customers = res.results.map((customer: any) => ({
          ...customer,
          checked: false,
        }));
        this.totalCount = res.count;
        this.currentPage = page;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('❌ Failed to fetch customers:', err);
        this.isLoading = false;
      },
    });
  }

  onPageChange(page: number) {
    this.loadCustomers(page);
  }

  toggleSelectAll(): void {
    this.selectAll = !this.selectAll;
    this.customers = this.customers.map((customer) => ({
      ...customer,
      checked: this.selectAll,
    }));
  }

  toggleChecked(id: number): void {
    this.customers = this.customers.map((customer) => {
      if (customer.id === id) {
        return {
          ...customer,
          checked: !customer.checked,
        };
      }
      return customer;
    });

    this.selectAll = this.customers.every((c) => c.checked);
  }

  get totalPages(): number {
    return Math.ceil(this.totalCount / this.itemsPerPage);
  }
}
