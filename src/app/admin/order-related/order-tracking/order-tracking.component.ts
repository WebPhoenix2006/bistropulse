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
    { key: 'Delivered', label: 'Delivered', icon: '✓' }
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
      next: (data: Order) => {
        console.log('✅ Order update received:', data);
        this.orderData = data;
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
      const orderData = await this.trackingService.getOrderDetails(this.restaurantId, this.orderId);
      this.orderData = orderData;
      this.updateProfileStatus();
    } catch (error) {
      console.error('❌ Failed to load order details:', error);
    }
  }

  private updateProfileStatus(): void {
    if (this.orderData?.customer?.photo_url || this.orderData?.rider?.profile_image_url) {
      this.hasProfile.set(true);
    } else {
      this.hasProfile.set(false);
    }
  }

  // Helper methods for template
  getStatusIndex(status: string): number {
    return this.statusTimeline.findIndex(s => s.key === status);
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
      minute: '2-digit'
    });
  }

  getSubtotal(): number {
    if (!this.orderData?.items) return 0;
    return this.orderData.items.reduce((sum, item) => {
      return sum + (parseFloat(item.unit_price) * item.quantity);
    }, 0);
  }

  getGrandTotal(): number {
    if (!this.orderData) return 0;
    const subtotal = this.getSubtotal();
    const deliveryFee = parseFloat(this.orderData.delivery_fee || '0');
    const platformFee = parseFloat(this.orderData.platform_fee || '0');
    const tax = parseFloat(this.orderData.tax || '0');
    return subtotal + deliveryFee + platformFee + tax;
  }

  // Template helper methods for parsing
  parseFloat(value: string): number {
    return parseFloat(value);
  }

  getItemTotal(item: OrderItem): number {
    return parseFloat(item.unit_price) * item.quantity;
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
    }
  }

  onCallRider(): void {
    if (this.orderData?.rider?.phone) {
      window.open(`tel:${this.orderData.rider.phone}`);
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