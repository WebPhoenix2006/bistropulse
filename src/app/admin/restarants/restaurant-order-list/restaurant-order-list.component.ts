import { Component, OnInit, signal, HostListener, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExportService } from '../../../shared/utils/export.utils';

interface Order {
  id: string;
  date: string;
  customer: {
    name: string;
    avatar?: string;
  };
  price: number;
  status:
    | 'Pending'
    | 'Being Prepared'
    | 'On The Way'
    | 'Delivered'
    | 'Cancelled';
  checked?: boolean;
  isToolbarOpen?: boolean;
}

@Component({
  selector: 'app-restaurant-order-list',
  standalone: false,
  templateUrl: './restaurant-order-list.component.html',
  styleUrl: './restaurant-order-list.component.scss',
})
export class RestaurantOrderListComponent implements OnInit {
  restaurantId = signal<string>('');

  exportService = new ExportService();

   exportOptions = [
    {
      label: 'To .csv',
      value: 'csv',
      icon: 'location',
      iconPosition: 'left',
      action: () => this.exportService.exportToCsv('ordersTable', 'orders.csv')
    },
  ];
  // Modal and UI management
  toggleFilterModal(): void {
    this.isFilterModalOpen.set(!this.isFilterModalOpen());
    this.closeAllToolbars();
  }

  constructor(private router: Router, private activeRoute: ActivatedRoute) {}

  @HostListener('document:click', ['$event'])
  handleDocumentClick(event: MouseEvent) {
    const clickedElement = event.target as HTMLElement;
    const isInsideToolbar = clickedElement.closest('.toolbar') !== null;
    const isToolbarToggle = clickedElement.closest('.toolbar-toggle') !== null;
    const isInsideFilter = clickedElement.closest('#filter-modal') !== null;
    const isFilterButton =
      clickedElement.closest('#filter-modal-button') !== null;

    if (!isInsideToolbar && !isToolbarToggle) {
      this.closeAllToolbars();
    }
    if (!isInsideFilter && !isFilterButton) {
      this.isFilterModalOpen.set(false);
    }
  }

  toggleOrderToolbar(orderId: string, event?: Event): void {
    event?.stopPropagation();

    const currentOrder = this.orders.find((o) => o.id === orderId);
    const currentState = currentOrder?.isToolbarOpen || false;

    // Close all toolbars first
    this.closeAllToolbars();

    // Toggle the clicked one if it wasn't open
    if (!currentState && currentOrder) {
      currentOrder.isToolbarOpen = true;
    }
  }

  closeAllToolbars(): void {
    this.orders.forEach((order) => (order.isToolbarOpen = false));
  }

  // Order actions
  viewOrder(orderId: string): void {
    this.router.navigateByUrl(
      `/admin/restaurants/${this.restaurantId()}/orders/${orderId}/order-details`
    );
  }

  updateOrderStatus(orderId: string, newStatus: Order['status']): void {
    const order = this.orders.find((o) => o.id === orderId);
    if (order) {
      order.status = newStatus;
      this.updateStatusCounts();
      this.applyFilters();
    }
  }

  deleteOrder(orderId: string): void {
    if (confirm('Are you sure you want to delete this order?')) {
      this.orders = this.orders.filter((o) => o.id !== orderId);
      this.selectedOrders.delete(orderId);
      this.updateStatusCounts();
      this.applyFilters();
    }
  }

  // Utility methods
  getStatusColor(status: Order['status']): string {
    switch (status) {
      case 'Pending':
        return 'orange-badge';
      case 'Cancelled':
        return 'red-badge';
      case 'On The Way':
        return 'lightblue-badge';
      case 'Delivered':
        return 'green-badge';
      case 'Being Prepared':
        return 'darkblue-badge';
      default:
        return 'gray-badge';
    }
  }

  formatPrice(price: number): string {
    return `₦ ${price.toFixed(2)}`;
  }

  get totalPages(): number {
    return Math.ceil(this.totalCount / this.itemsPerPage);
  }

  get filteredOrders(): Order[] {
    return this.filteredList;
  }

  // Bulk operations
  deleteSelectedOrders(): void {
    if (this.selectedOrders.size === 0) return;

    const selectedCount = this.selectedOrders.size;
    if (
      confirm(
        `Are you sure you want to delete ${selectedCount} selected order(s)?`
      )
    ) {
      this.orders = this.orders.filter(
        (order) => !this.selectedOrders.has(order.id)
      );
      this.selectedOrders.clear();
      this.updateStatusCounts();
      this.applyFilters();
    }
  }

  exportSelectedOrders(): void {
    if (this.selectedOrders.size === 0) return;

    const selectedOrdersData = this.orders.filter((order) =>
      this.selectedOrders.has(order.id)
    );
    console.log('Exporting orders:', selectedOrdersData);
    // Implement actual export logic here
  }
  isFilterModalOpen = signal<boolean>(false);
  buttonText = signal<string>('Filter');
  searchTerm = signal<string>('');
  isLoading = signal<boolean>(false);
  selectedStatus = signal<string>('All');

  // Order management
  orders: Array<Order> = [];
  filteredList: Array<Order> = [];
  selectedOrders = new Set<string>();

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalCount = 0;

  // Status tabs
  statusTabs = [
    { key: 'All', label: 'All', count: 0 },
    { key: 'Pending', label: 'Pending', count: 0 },
    { key: 'Being Prepared', label: 'Being Prepared', count: 0 },
    { key: 'On The Way', label: 'On The Way', count: 0 },
    { key: 'Delivered', label: 'Delivered', count: 0 },
    { key: 'Cancelled', label: 'Cancelled', count: 0 },
  ];

  getRestaurantId(): string {
    const id = this.activeRoute.snapshot.paramMap.get('id');
    this.restaurantId.set(id);
    return id;
  }

  ngOnInit() {
    this.loadDummyOrders();
    this.applyFilters();
    this.getRestaurantId();
  }

  loadDummyOrders(): void {
    this.isLoading.set(true);

    // Simulate API delay
    setTimeout(() => {
      this.orders = [
        {
          id: 'B13789',
          date: 'Feb 08, 2022',
          customer: {
            name: 'Dianne Russell',
            avatar: 'assets/images/avatar.png',
          },
          price: 90.0,
          status: 'Pending',
          checked: false,
          isToolbarOpen: false,
        },
        {
          id: 'B13790',
          date: 'Feb 08, 2022',
          customer: {
            name: 'Leslie Alexander',
            avatar: 'assets/images/avatar.png',
          },
          price: 75.0,
          status: 'Being Prepared',
          checked: false,
          isToolbarOpen: false,
        },
        {
          id: 'B13791',
          date: 'Feb 06, 2022',
          customer: {
            name: 'Ralph Edwards',
            avatar: 'assets/images/avatar.png',
          },
          price: 110.0,
          status: 'Cancelled',
          checked: false,
          isToolbarOpen: false,
        },
        {
          id: 'B13792',
          date: 'Feb 08, 2022',
          customer: {
            name: 'Jane Cooper',
            avatar: 'assets/images/avatar.png',
          },
          price: 80.0,
          status: 'Delivered',
          checked: false,
          isToolbarOpen: false,
        },
        {
          id: 'B13793',
          date: 'Feb 08, 2022',
          customer: {
            name: 'Kathryn Murphy',
            avatar: 'assets/images/avatar.png',
          },
          price: 80.0,
          status: 'On The Way',
          checked: false,
          isToolbarOpen: false,
        },
        {
          id: 'B13794',
          date: 'Feb 08, 2022',
          customer: {
            name: 'Jenny Wilson',
            avatar: 'assets/images/avatar.png',
          },
          price: 30.0,
          status: 'Pending',
          checked: false,
          isToolbarOpen: false,
        },
        {
          id: 'B13795',
          date: 'Feb 08, 2022',
          customer: {
            name: 'Jacob Jones',
            avatar: 'assets/images/avatar.png',
          },
          price: 70.0,
          status: 'Being Prepared',
          checked: false,
          isToolbarOpen: false,
        },
        {
          id: 'B13796',
          date: 'Feb 08, 2022',
          customer: {
            name: 'Courtney Henry',
            avatar: 'assets/images/avatar.png',
          },
          price: 60.0,
          status: 'Cancelled',
          checked: false,
          isToolbarOpen: false,
        },
      ];

      this.updateStatusCounts();
      this.applyFilters();
      this.isLoading.set(false);
    }, 500);
  }

  updateStatusCounts(): void {
    this.statusTabs.forEach((tab) => {
      if (tab.key === 'All') {
        tab.count = this.orders.length;
      } else {
        tab.count = this.orders.filter(
          (order) => order.status === tab.key
        ).length;
      }
    });
  }

  applyFilters(): void {
    let filtered = this.orders;

    // Filter by search term
    if (this.searchTerm()) {
      const term = this.searchTerm().toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(term) ||
          order.customer.name.toLowerCase().includes(term)
      );
    }

    // Filter by status
    if (this.selectedStatus() !== 'All') {
      filtered = filtered.filter(
        (order) => order.status === this.selectedStatus()
      );
    }

    this.totalCount = filtered.length;
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.filteredList = filtered.slice(startIndex, endIndex);
  }

  onStatusTabChange(status: string): void {
    this.selectedStatus.set(status);
    this.currentPage = 1;
    this.clearSelection();
    this.applyFilters();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.applyFilters();
  }

  // Selection management using Set
  toggleSelection(orderId: string, event?: Event): void {
    event?.stopPropagation();

    if (this.selectedOrders.has(orderId)) {
      this.selectedOrders.delete(orderId);
    } else {
      this.selectedOrders.add(orderId);
    }

    // Update the checked property in the order object
    const order = this.filteredList.find((o) => o.id === orderId);
    if (order) {
      order.checked = this.selectedOrders.has(orderId);
    }
  }

  toggleSelectAll(): void {
    const allSelected = this.filteredList.every((order) =>
      this.selectedOrders.has(order.id)
    );

    if (allSelected) {
      // Deselect all
      this.filteredList.forEach((order) => {
        this.selectedOrders.delete(order.id);
        order.checked = false;
      });
    } else {
      // Select all
      this.filteredList.forEach((order) => {
        this.selectedOrders.add(order.id);
        order.checked = true;
      });
    }
  }

  isSelected(orderId: string): boolean {
    return this.selectedOrders.has(orderId);
  }

  allChecked(): boolean {
    return (
      this.filteredList.length > 0 &&
      this.filteredList.every((order) => this.selectedOrders.has(order.id))
    );
  }

  clearSelection(): void {
    this.selectedOrders.clear();
    this.orders.forEach((order) => (order.checked = false));
  }

  getSelectedCount(): number {
    return this.selectedOrders.size;
  }
}

//
