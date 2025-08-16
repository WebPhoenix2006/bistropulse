import {
  Component,
  HostListener,
  OnInit,
  OnDestroy,
  signal,
} from '@angular/core';
import { RiderService } from '../../../shared/services/rider.service';
import { RestaurantService } from '../../../shared/services/restaurant.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SlowNetworkService } from '../../../shared/services/slow-nerwork.service';
import { BootstrapToastService } from '../../../shared/services/bootstrap-toast.service';
import { RiderRequestInterface } from '../../../interfaces/rider.interface';
import { ImageViewerService } from '../../../shared/services/image-viewer.service';
import { OrderTrackingService } from '../../../shared/services/order-tracking.service';
import { Subscription } from 'rxjs';

// Import interfaces from OrderTrackingService
import {
  Order,
  OrderItem,
  Customer,
  Rider,
  Location,
  WebSocketMessage,
} from '../../order-related/order-tracking/order-tracking.component';

interface DropdownOption {
  label: string;
  value: string;
  icon?: string;
  iconPosition?: 'left' | 'right';
}

interface DeliveryPerson {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  status: 'completed' | 'active' | 'pending';
}

@Component({
  selector: 'app-restaurant-order-details',
  standalone: false,
  templateUrl: './restaurant-order-details.component.html',
  styleUrl: './restaurant-order-details.component.scss',
})
export class RestaurantOrderDetailsComponent implements OnInit, OnDestroy {
  // *** CONSTRUCTOR DECLARED BELOW ***
  constructor(
    private riderService: RiderService,
    private restaurantService: RestaurantService,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private slowNetwork: SlowNetworkService,
    private toastr: BootstrapToastService,
    private viewerService: ImageViewerService,
    private orderTrackingService: OrderTrackingService
  ) {}

  // *** REAL-TIME ORDER DATA ***
  orderData?: Order;
  private orderSubscription?: Subscription;
  private connectionSubscription?: Subscription;
  hasProfile = signal<boolean>(true);

  // *** EXISTING VARIABLES ***
  isLoading = signal<boolean>(false);
  restaurantId = signal<string | null>(null);
  orderId = signal<string | null>(null);

  // Dropdown options for assign deliveryman
  isDeliverymanDropdownOpen = signal<boolean>(false);
  searchTerm: string = '';
  riders: RiderRequestInterface[] = [];

  // *** METHOD FOR SETTING IDS ***
  setRestaurantId(): string | null {
    return (
      this.activeRoute.snapshot.paramMap.get('restaurantId') ||
      this.activeRoute.snapshot.paramMap.get('id')
    );
  }

  setOrderId(): string | null {
    return (
      this.activeRoute.snapshot.paramMap.get('orderId') ||
      this.activeRoute.snapshot.paramMap.get('orderNumber')
    );
  }

  // *** METHOD FOR USING THE VIEWER SERVICE ***
  openImage(url: string) {
    this.viewerService.open(url);
  }

  // *** REAL-TIME ORDER TRACKING METHODS ***
  async loadOrderDetails(): Promise<void> {
    const restaurantId = this.restaurantId();
    const orderId = this.orderId();

    if (!restaurantId || !orderId) {
      console.error('❌ Restaurant ID and Order ID are required');
      this.toastr.showError('Missing required order information');
      return;
    }

    try {
      this.isLoading.set(true);
      console.log('🔄 Loading order details...');

      // Load initial order data
      const orderData = await this.orderTrackingService.getOrderDetails(
        'B6488',
        'BO7813828'
      );
      this.orderData = orderData;
      this.updateProfileStatus();

      console.log('✅ Order details loaded:', orderData);
      this.toastr.showSuccess('Order details loaded');

      // Connect to WebSocket for real-time updates
      this.connectToRealTimeUpdates(orderId);
    } catch (error) {
      console.error('❌ Failed to load order details:', error);
      this.toastr.showError('Failed to load order details');
    } finally {
      this.isLoading.set(false);
    }
  }

  connectToRealTimeUpdates(orderId: string): void {
    console.log('🔄 Connecting to real-time updates for order:', orderId);

    // Connect to WebSocket
    this.orderTrackingService.connect(orderId);

    // Subscribe to order updates
    this.orderSubscription = this.orderTrackingService.getUpdates().subscribe({
      next: (data: Order) => {
        console.log('✅ Real-time order update received:', data);
        this.handleOrderUpdate(data);
      },
      error: (err) => {
        console.error('❌ WebSocket error:', err);
        this.toastr.showWarning('Real-time updates temporarily unavailable');
      },
    });

    // Subscribe to connection status
    this.connectionSubscription = this.orderTrackingService
      .getConnectionStatus()
      .subscribe({
        next: (isConnected: boolean) => {
          if (isConnected) {
            console.log('✅ Real-time connection established');
            this.toastr.showSuccess('Real-time updates connected', 2000);
          } else {
            console.log('❌ Real-time connection lost');
            this.toastr.showWarning('Real-time connection lost', 2000);
          }
        },
      });
  }

  handleOrderUpdate(newOrderData: Order): void {
    // Merge with existing data to prevent field clearing
    if (this.orderData) {
      this.orderData = {
        ...this.orderData,
        ...newOrderData,
        // Ensure nested objects are properly merged
        customer: {
          ...this.orderData.customer,
          ...(newOrderData.customer || {}),
        },
        rider: { ...this.orderData.rider, ...(newOrderData.rider || {}) },
        pickup_location: {
          ...this.orderData.pickup_location,
          ...(newOrderData.pickup_location || {}),
        },
        dropoff_location: {
          ...this.orderData.dropoff_location,
          ...(newOrderData.dropoff_location || {}),
        },
        current_location: {
          ...this.orderData.current_location,
          ...(newOrderData.current_location || {}),
        },
      };
    } else {
      this.orderData = newOrderData;
    }

    // Fix profile_image_url if needed
    if (
      this.orderData.rider &&
      this.orderData.rider.profile_image &&
      !this.orderData.rider.profile_image_url
    ) {
      const baseUrl = 'http://bistropulse-backend.onrender.com';
      this.orderData.rider.profile_image_url =
        baseUrl + this.orderData.rider.profile_image;
    }

    this.updateProfileStatus();
    this.toastr.showInfo('Order updated', 1500);
  }

  private updateProfileStatus(): void {
    const hasCustomerPhoto = Boolean(this.orderData?.customer?.photo_url);
    const hasRiderPhoto = Boolean(this.orderData?.rider?.profile_image_url);
    this.hasProfile.set(hasCustomerPhoto || hasRiderPhoto);
  }

  // *** RIDER MANAGEMENT METHODS ***
  getRiders(): void {
    const restaurantId = this.restaurantId();
    if (!restaurantId) return;

    this.isLoading.set(true);
    this.slowNetwork.start(() => {
      if (this.isLoading()) {
        this.toastr.showWarning(
          'Fetching riders is taking longer than usual',
          3000
        );
      }
    });

    this.riderService.getRestaurantRiders(restaurantId).subscribe({
      next: (data: any) => {
        console.log('✅ Riders fetched:', data);
        this.toastr.showSuccess('Riders loaded');
        this.slowNetwork.clear();
        this.riders = data.results;
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('❌ Failed to fetch riders:', err);
        this.toastr.showError('Failed to fetch riders');
        this.isLoading.set(false);
        this.slowNetwork.clear();
      },
    });
  }

  async selectRider(rider: RiderRequestInterface): Promise<void> {
    const restaurantId = this.restaurantId();
    const orderId = this.orderId();

    if (!restaurantId || !orderId) {
      this.toastr.showError('Missing required information');
      return;
    }

    try {
      console.log('🔄 Assigning rider:', rider);
      this.isLoading.set(true);

      // Call the API to assign rider
      await this.orderTrackingService.assignRider(
        restaurantId,
        orderId,
        rider.rider_code
      );

      this.toastr.showSuccess(`Rider ${rider.full_name} assigned successfully`);
      this.isDeliverymanDropdownOpen.set(false);
    } catch (error) {
      console.error('❌ Failed to assign rider:', error);
      this.toastr.showError('Failed to assign rider');
    } finally {
      this.isLoading.set(false);
    }
  }

  // *** UTILITY METHODS FROM ORIGINAL ORDER TRACKING ***
  getFormattedDate(dateString?: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  }

  getStatusClass(): string {
    if (!this.orderData?.status) {
      return 'orange-badge';
    }
    return this.getStatusClassByStatus(this.orderData.status);
  }

  getStatusClassByStatus(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending':
      case 'placed':
        return 'orange-badge';
      case 'cancelled':
        return 'red-badge';
      case 'preparing':
      case 'being prepared':
      case 'accepted':
        return 'lightblue-badge';
      case 'delivered':
        return 'green-badge';
      case 'on the way':
        return 'darkblue-badge';
      default:
        return 'gray-badge';
    }
  }

  getCustomerInitials(): string {
    const name = this.orderData?.customer?.name;
    if (!name) return '??';

    const parts = name.split(' ');
    const first = parts[0]?.charAt(0).toUpperCase() || '';
    const last = parts[1]?.charAt(0).toUpperCase() || '';
    return first + last;
  }

  getRiderInitials(): string {
    const name = this.orderData?.rider?.full_name;
    if (!name) return '??';

    const parts = name.split(' ');
    const first = parts[0]?.charAt(0).toUpperCase() || '';
    const last = parts[1]?.charAt(0).toUpperCase() || '';
    return first + last;
  }

  // Safe parseFloat helper method
  private safeParseFloat(value: string | undefined | null): number {
    if (value === null || value === undefined || value === '') return 0;
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  }

  // *** CALCULATION METHODS ***
  getSubtotal(): number {
    if (!this.orderData?.items) return 0;
    return this.orderData.items.reduce((sum, item) => {
      const unitPrice = this.safeParseFloat(item?.unit_price);
      const quantity = item?.quantity || 0;
      return sum + unitPrice * quantity;
    }, 0);
  }

  getDeliveryFee(): number {
    return this.safeParseFloat(this.orderData?.delivery_fee);
  }

  getPlatformFee(): number {
    return this.safeParseFloat(this.orderData?.platform_fee);
  }

  getTax(): number {
    return this.safeParseFloat(this.orderData?.tax);
  }

  getGrandTotal(): number {
    if (!this.orderData) return 0;
    const subtotal = this.getSubtotal();
    const deliveryFee = this.getDeliveryFee();
    const platformFee = this.getPlatformFee();
    const tax = this.getTax();
    return subtotal + deliveryFee + platformFee + tax;
  }

  getItemTotal(item: OrderItem | null | undefined): number {
    if (!item) return 0;
    const unitPrice = this.safeParseFloat(item.unit_price);
    const quantity = item.quantity || 0;
    return unitPrice * quantity;
  }

  formatCurrency(amount: number): string {
    return `₵ ${amount.toFixed(2)}`;
  }

  formatGHCurrency(amount: number): string {
    return `GHC ${amount.toFixed(2)}`;
  }

  // *** DROPDOWN AND UI METHODS ***
  @HostListener('document:keydown.escape', ['$event'])
  handleEscape(event: KeyboardEvent) {
    if (this.isDeliverymanDropdownOpen()) {
      this.isDeliverymanDropdownOpen.set(false);
    }
  }

  toggleDeliverymanDropdown(): void {
    this.isDeliverymanDropdownOpen.set(!this.isDeliverymanDropdownOpen());
  }

  highlightMatch(text: string): string {
    if (!this.searchTerm || !text) {
      return text;
    }

    const searchRegex = new RegExp(`(${this.searchTerm})`, 'gi');
    return text.replace(searchRegex, '<span class="highlight">$1</span>');
  }

  get filteredRiders() {
    if (!this.searchTerm.trim()) {
      return this.riders;
    }
    return this.riders.filter(
      (rider) =>
        rider.full_name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        rider.phone.includes(this.searchTerm)
    );
  }

  // *** STATUS AND PAYMENT ACTIONS ***
  async onStatusChange(newStatus: string): Promise<void> {
    const restaurantId = this.restaurantId();
    const orderId = this.orderId();

    if (!restaurantId || !orderId) {
      this.toastr.showError('Missing required information');
      return;
    }

    try {
      console.log('🔄 Updating order status to:', newStatus);
      this.isLoading.set(true);

      await this.orderTrackingService.updateOrderStatus(
        restaurantId,
        orderId,
        newStatus
      );
      this.toastr.showSuccess(`Order status updated to ${newStatus}`);
    } catch (error) {
      console.error('❌ Failed to update status:', error);
      this.toastr.showError('Failed to update order status');
    } finally {
      this.isLoading.set(false);
    }
  }

  async onPaymentStatusChange(newPaymentStatus: string): Promise<void> {
    const restaurantId = this.restaurantId();
    const orderId = this.orderId();

    if (!restaurantId || !orderId) {
      this.toastr.showError('Missing required information');
      return;
    }

    try {
      console.log('🔄 Updating payment status to:', newPaymentStatus);
      this.isLoading.set(true);

      await this.orderTrackingService.updatePaymentStatus(
        restaurantId,
        orderId,
        newPaymentStatus
      );
      this.toastr.showSuccess(`Payment status updated to ${newPaymentStatus}`);
    } catch (error) {
      console.error('❌ Failed to update payment status:', error);
      this.toastr.showError('Failed to update payment status');
    } finally {
      this.isLoading.set(false);
    }
  }

  // *** COMMUNICATION METHODS ***
  onCallCustomer(): void {
    if (this.orderData?.customer?.phone) {
      window.open(`tel:${this.orderData.customer.phone}`);
      console.log('📞 Calling customer:', this.orderData.customer.phone);
    } else {
      this.toastr.showWarning('Customer phone number not available');
    }
  }

  onCallRider(): void {
    if (this.orderData?.rider?.phone) {
      window.open(`tel:${this.orderData.rider.phone}`);
      console.log('📞 Calling rider:', this.orderData.rider.phone);
    } else {
      this.toastr.showWarning('Rider phone number not available');
    }
  }

  onMessageRider(): void {
    if (this.orderData?.rider?.phone) {
      // You can implement SMS or WhatsApp integration here
      console.log('💬 Message rider:', this.orderData.rider.phone);
      this.toastr.showInfo('Messaging feature coming soon');
    } else {
      this.toastr.showWarning('Rider phone number not available');
    }
  }

  // *** LIFECYCLE METHODS ***
  ngOnInit(): void {
    console.log('🚀 RestaurantOrderDetailsComponent initialized');

    // Set IDs from route
    this.restaurantId.set(this.setRestaurantId());
    this.orderId.set(this.setOrderId());

    console.log('📍 Restaurant ID:', this.restaurantId());
    console.log('📍 Order ID:', this.orderId());

    // Load initial data
    this.loadOrderDetails();
    this.getRiders();
  }

  ngOnDestroy(): void {
    console.log('🔌 Disconnecting from real-time updates');

    if (this.orderSubscription) {
      this.orderSubscription.unsubscribe();
    }

    if (this.connectionSubscription) {
      this.connectionSubscription.unsubscribe();
    }

    this.orderTrackingService.disconnect();
    this.slowNetwork.clear();
  }

  // *** DELIVERY PROGRESS METHODS (you can enhance these with real data) ***
  getDeliveryProgress(): DeliveryPerson[] {
    // This could be enhanced to show actual delivery timeline based on order status
    return [
      {
        id: '1',
        name: 'Order Placed',
        phone: '',
        avatar: '',
        status: this.orderData?.status === 'Placed' ? 'active' : 'completed',
      },
      {
        id: '2',
        name: 'Order Accepted',
        phone: '',
        avatar: '',
        status:
          this.orderData?.status === 'Accepted'
            ? 'active'
            : ['Placed'].includes(this.orderData?.status || '')
            ? 'pending'
            : 'completed',
      },
      {
        id: '3',
        name: 'Being Prepared',
        phone: '',
        avatar: '',
        status:
          this.orderData?.status === 'Being prepared'
            ? 'active'
            : ['Placed', 'Accepted'].includes(this.orderData?.status || '')
            ? 'pending'
            : 'completed',
      },
      {
        id: '4',
        name: this.orderData?.rider?.full_name || 'On the way',
        phone: this.orderData?.rider?.phone || '',
        avatar: this.orderData?.rider?.profile_image_url || '',
        status:
          this.orderData?.status === 'On the way'
            ? 'active'
            : ['Placed', 'Accepted', 'Being prepared'].includes(
                this.orderData?.status || ''
              )
            ? 'pending'
            : 'completed',
      },
      {
        id: '5',
        name: 'Delivered',
        phone: '',
        avatar: '',
        status:
          this.orderData?.status === 'Delivered' ? 'completed' : 'pending',
      },
    ];
  }

  isDeliveryPersonCompleted(person: DeliveryPerson): boolean {
    return person.status === 'completed';
  }

  isDeliveryPersonActive(person: DeliveryPerson): boolean {
    return person.status === 'active';
  }

  isDeliveryPersonPending(person: DeliveryPerson): boolean {
    return person.status === 'pending';
  }

  getTotalItems(): number {
    return (
      this.orderData?.items?.reduce(
        (total, item) => total + (item.quantity || 0),
        0
      ) || 0
    );
  }

  getItemsText(): string {
    const totalItems = this.getTotalItems();
    return totalItems === 1 ? 'item' : 'items';
  }
}
