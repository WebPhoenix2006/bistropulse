import { Component, Input, OnDestroy, OnInit, signal } from '@angular/core';
import { Subscription } from 'rxjs';

import { OrderTrackingService } from '../../../shared/services/order-tracking.service';

// Updated interfaces to match your API response
export interface OrderItem {
  food: number;
  quantity: number;
  unit_price: string;
  food_name?: string; // You might want to populate this from food details
  food_image?: string;
}

export interface Customer {
  id: number;
  customer_id: string;
  name: string;
  email: string;
  phone: string;
  is_student: boolean;
  gender: string;
  location: string;
  photo_url: string;
  created_at: string;
}

export interface Rider {
  rider_code: string;
  full_name: string;
  phone: string;
  profile_image: string;
  profile_image_url: string;
  date_of_birth: string;
  gender: string;
  address: string;
  restaurant: string;
  is_active: boolean;
}

export interface Location {
  lat: number;
  lng: number;
}

export interface Order {
  order_id: string;
  rider: Rider;
  customer: Customer;
  restaurant: string;
  branch?: string;
  pickup_location: Location;
  dropoff_location: Location;
  current_location: Location;
  status: string;
  date_ordered: string;
  date_delivered?: string;
  payment_method: string;
  payment_status: string;
  delivery_fee: string;
  platform_fee: string;
  tax: string;
  total: string;
  items?: OrderItem[]; // Items might be included in some responses
}

// WebSocket message interface
export interface WebSocketMessage {
  action: string;
  order: Order;
}

@Component({
  selector: 'app-order-tracking',
  templateUrl: './order-tracking.component.html',
  styleUrls: ['./order-tracking.component.scss'],
  standalone: false,
})
export class OrderTrackingComponent implements OnInit, OnDestroy {
  @Input() orderId!: string;
  @Input() restaurantId!: string;

  hasProfile = signal<boolean>(true);
  orderData?: Order;
  private subscription?: Subscription;

  // Order status timeline configuration
  statusTimeline = [
    { key: 'Placed', label: 'Placed', icon: '✓' },
    { key: 'Accepted', label: 'Accepted', icon: '✓' },
    { key: 'Being prepared', label: 'Being prepared', icon: '✓' },
    { key: 'On the way', label: 'On the way', icon: '✓' },
    { key: 'Delivered', label: 'Delivered', icon: '✓' },
  ];

  constructor(private trackingService: OrderTrackingService) {}

  ngOnInit(): void {
    if (!this.orderId || !this.restaurantId) {
      console.error('❌ Order ID and Restaurant ID are required');
      return;
    }

    console.log('🔄 Connecting to order:', this.orderId);

    // Connect to WebSocket for real-time updates
    this.trackingService.connect(this.orderId);

    // Subscribe to order updates
    this.subscription = this.trackingService.getUpdates().subscribe({
      next: (data: WebSocketMessage | Order) => {
        console.log('✅ Order update received:', data);
        console.log('🔍 Data structure:', JSON.stringify(data, null, 2));
        
        // Handle WebSocket message format vs direct order format
        let orderData: Order;
        if ('action' in data && 'order' in data) {
          // WebSocket message format
          orderData = (data as WebSocketMessage).order;
          console.log('📦 Extracted order data from WebSocket message');
        } else {
          // Direct order format
          orderData = data as Order;
          console.log('📦 Using direct order data');
        }
        
        // Fix profile_image_url if it's null but profile_image exists
        if (orderData.rider && orderData.rider.profile_image && !orderData.rider.profile_image_url) {
          // Assuming your backend base URL pattern
          const baseUrl = 'http://bistropulse-backend.onrender.com';
          orderData.rider.profile_image_url = baseUrl + orderData.rider.profile_image;
        }
        
        // Merge with existing data to prevent field clearing, but prioritize new data
        if (this.orderData) {
          this.orderData = { 
            ...this.orderData, 
            ...orderData,
            // Ensure nested objects are properly merged
            customer: { ...this.orderData.customer, ...orderData.customer },
            rider: { ...this.orderData.rider, ...orderData.rider },
            pickup_location: { ...this.orderData.pickup_location, ...orderData.pickup_location },
            dropoff_location: { ...this.orderData.dropoff_location, ...orderData.dropoff_location },
            current_location: { ...this.orderData.current_location, ...orderData.current_location }
          };
        } else {
          this.orderData = orderData;
        }
        
        this.updateProfileStatus();
      },
      error: (err) => {
        console.error('❌ WebSocket error:', err);
      },
    });

    // Initial API call to get order details
    this.loadOrderDetails();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.trackingService.disconnect();
  }

  private async loadOrderDetails(): Promise<void> {
    try {
      // You'll need to implement this method in your service
      const orderData = await this.trackingService.getOrderDetails(
        this.restaurantId,
        this.orderId
      );
      console.log('🔍 Initial order data:', JSON.stringify(orderData, null, 2));
      this.orderData = orderData;
      this.updateProfileStatus();
    } catch (error) {
      console.error('❌ Failed to load order details:', error);
    }
  }

  // Helper methods for template
  getStatusIndex(status: string): number {
    return this.statusTimeline.findIndex((s) => s.key === status);
  }

  isStatusActive(statusIndex: number): boolean {
    if (!this.orderData) return false;
    const currentStatusIndex = this.getStatusIndex(this.orderData.status);
    return statusIndex <= currentStatusIndex;
  }

  getFormattedDate(dateString?: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  getStatusClass(): string {
    if (!this.orderData?.status) {
      return 'status-badge--unknown';
    }
    return (
      'status-badge--' + this.orderData.status.toLowerCase().replace(' ', '-')
    );
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

  // Debug helper to check data structure
  private debugOrderData(): void {
    if (this.orderData) {
      console.log('🔍 Current orderData structure:');
      console.log('- order_id:', this.orderData.order_id);
      console.log('- status:', this.orderData.status);
      console.log('- customer:', this.orderData.customer);
      console.log('- rider:', this.orderData.rider);
      console.log('- items:', this.orderData.items);
      console.log('- fees:', {
        delivery_fee: this.orderData.delivery_fee,
        platform_fee: this.orderData.platform_fee,
        tax: this.orderData.tax
      });
    }
  }

  // Fee calculation helper methods
  getDeliveryFee(): number {
    return this.safeParseFloat(this.orderData?.delivery_fee);
  }

  getPlatformFee(): number {
    return this.safeParseFloat(this.orderData?.platform_fee);
  }

  getTax(): number {
    return this.safeParseFloat(this.orderData?.tax);
  }

  // Update existing methods to handle undefined values safely
  getSubtotal(): number {
    if (!this.orderData?.items) return 0;
    return this.orderData.items.reduce((sum, item) => {
      const unitPrice = this.safeParseFloat(item?.unit_price);
      const quantity = item?.quantity || 0;
      return sum + unitPrice * quantity;
    }, 0);
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

  // Update the updateProfileStatus method
  private updateProfileStatus(): void {
    const hasCustomerPhoto = Boolean(this.orderData?.customer?.photo_url);
    const hasRiderPhoto = Boolean(this.orderData?.rider?.profile_image_url);
    this.hasProfile.set(hasCustomerPhoto || hasRiderPhoto);
    
    // Debug the current state
    this.debugOrderData();
  }

  // Action methods
  onAssignDeliveryMan(): void {
    // Implement delivery man assignment logic
    console.log('Assign delivery man clicked');
  }

  onPaymentAction(): void {
    // Implement payment action logic
    console.log('Payment action clicked');
  }

  onStatusChange(): void {
    // Implement status change logic
    console.log('Status change clicked');
  }

  onCallCustomer(): void {
    if (this.orderData?.customer?.phone) {
      window.open(`tel:${this.orderData.customer.phone}`);
    } else {
      console.log('No customer phone number available');
    }
  }

  onCallRider(): void {
    if (this.orderData?.rider?.phone) {
      window.open(`tel:${this.orderData.rider.phone}`);
    } else {
      console.log('No rider phone number available');
    }
  }

  onMessageRider(): void {
    // Implement messaging logic
    console.log('Message rider clicked');
  }

  // Navigation methods
  onPreviousOrder(): void {
    // Implement previous order navigation
    console.log('Previous order clicked');
  }

  onNextOrder(): void {
    // Implement next order navigation
    console.log('Next order clicked');
  }
}