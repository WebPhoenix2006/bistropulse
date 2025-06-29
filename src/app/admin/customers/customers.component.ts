import { Component, HostListener, inject } from '@angular/core';
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

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers() {
    this.isLoading = true;
    this.customerService.getCustomers().subscribe({
      next: (data: any) => {
        this.customers = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to fetch customers', err);
        this.isLoading = false;
      },
    });
  }

  @HostListener('window:click')
  closeToolbars() {
    this.customers = this.customers.map((customer) => {
      return {
        ...customer,
        isToolbarOpen: false,
      };
    });
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
  }

  checkAll(): void {
    this.customers = this.customers.map((customer) => {
      return {
        ...customer,
        checked: !customer.checked,
      };
    });
  }

  toggleVisibility(id: number): void {
    this.closeToolbars();
    this.customers = this.customers.map((customer) => {
      if (customer.id === id) {
        return {
          ...customer,
          isToolbarOpen: !customer.isToolbarOpen,
        };
      } else {
        return customer;
      }
    });
  }
  closeAll(): void {
    this.customers = this.customers.map((customer) => {
      return {
        ...customer,
        isToolbarOpen: false,
      };
    });
  }
  handleAction(event: any, customer: any) {
    switch (event.value) {
      case 'view':
        console.log('Viewing customer', customer);
        break;
      case 'edit':
        console.log('Editing customer', customer);
        // Navigate or open modal
        break;
      case 'disable':
        console.log('Disabling customer', customer);
        // Maybe set customer.active = false and update on backend
        break;
    }
  }

  // handleAction(event: any, customerId: string) {
  //   if (event.value === 'edit') {
  //     console.log('Editing customer', customerId);
  //     // Navigate to edit page or open modal
  //   } else if (event.value === 'delete') {
  //     console.log('Deleting customer', customerId);
  //     // Call delete service
  //   }
  // }
}
