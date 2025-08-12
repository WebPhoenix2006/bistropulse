import { Component, OnInit, signal } from '@angular/core';

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

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  totalOrders: number;
  location: string;
  currentAddress: string;
  additionalDirection: string;
}

interface Order {
  id: string;
  status: string;
  date: string;
  estimatedDeliveryTime: string;
  items: OrderItem[];
  customer: Customer;
  assignedDeliveryGuy?: {
    name: string;
    phone: string;
    avatar: string;
  };
  pricing: {
    subtotal: number;
    deliveryFee: number;
    tax: number;
    total: number;
  };
}

@Component({
  selector: 'app-restaurant-order-details',
  standalone: false,
  templateUrl: './restaurant-order-details.component.html',
  styleUrl: './restaurant-order-details.component.scss',
})
export class RestaurantOrderDetailsComponent implements OnInit {
  // Dropdown options for assign deliveryman
  isDeliverymanDropdownOpen = signal<boolean>(false);

  // Dropdown options for payment
  paymentOptions: DropdownOption[] = [
    {
      label: 'Mark as Paid',
      value: 'paid',
      icon: 'check-circle',
      iconPosition: 'left',
    },
    {
      label: 'Payment Pending',
      value: 'pending',
      icon: 'clock',
      iconPosition: 'left',
    },
    {
      label: 'Payment Failed',
      value: 'failed',
      icon: 'times-circle',
      iconPosition: 'left',
    },
  ];

  // Dropdown options for status
  statusOptions: DropdownOption[] = [
    {
      label: 'Pending',
      value: 'pending',
      icon: 'clock',
      iconPosition: 'left',
    },
    {
      label: 'Preparing',
      value: 'preparing',
      icon: 'utensils',
      iconPosition: 'left',
    },
    {
      label: 'On the way',
      value: 'on_the_way',
      icon: 'truck',
      iconPosition: 'left',
    },
    {
      label: 'Delivered',
      value: 'delivered',
      icon: 'check-circle',
      iconPosition: 'left',
    },
    {
      label: 'Cancelled',
      value: 'cancelled',
      icon: 'times-circle',
      iconPosition: 'left',
    },
  ];

  // Mock data for delivery progress
  deliveryProgress: DeliveryPerson[] = [
    {
      id: '1',
      name: 'Ronald Richards',
      phone: '+8801905007770',
      avatar: 'assets/images/profile-img.png',
      status: 'completed',
    },
    {
      id: '2',
      name: 'Chelsie Johnson',
      phone: '+8801905007770',
      avatar: 'assets/images/profile-img.png',
      status: 'completed',
    },
    {
      id: '3',
      name: 'Darrell Steward',
      phone: '+8801905007770',
      avatar: 'assets/images/profile-img.png',
      status: 'completed',
    },
    {
      id: '4',
      name: 'Started',
      phone: '',
      avatar: '',
      status: 'active',
    },
    {
      id: '5',
      name: 'Albert Flores',
      phone: '+8801905007770',
      avatar: 'assets/images/profile-img.png',
      status: 'pending',
    },
    {
      id: '6',
      name: 'Wade Warren',
      phone: '+8801905007770',
      avatar: 'assets/images/profile-img.png',
      status: 'pending',
    },
  ];

  // Mock order data
  currentOrder: Order = {
    id: '#12009',
    status: 'On the way',
    date: 'Sat, Nov 28 • 7:30:35 PM',
    estimatedDeliveryTime: '12:45:10',
    items: [
      { id: '1', name: 'Star', price: 80.0, quantity: 1 },
      { id: '2', name: 'Star', price: 80.0, quantity: 1 },
      { id: '3', name: 'Star', price: 80.0, quantity: 1 },
      { id: '4', name: 'Star', price: 30.0, quantity: 1 },
    ],
    customer: {
      id: '1',
      name: 'Chelsie Johnson',
      email: 'chelsiejohnson@hotmail.com',
      phone: '+88 01600-009770',
      avatar: 'assets/images/profile-img.png',
      totalOrders: 39,
      location: 'Asafoatse Nettey Road, Accra...',
      currentAddress: '12 C, Asafoatse Nettey Road, Accra, Ghana',
      additionalDirection: 'Rest House on floor etc...',
    },
    assignedDeliveryGuy: {
      name: 'John Doe',
      phone: '+880 1234 5678',
      avatar: 'assets/images/profile-img.png',
    },
    pricing: {
      subtotal: 105.0,
      deliveryFee: 2.4,
      tax: 1.0,
      total: 185.0,
    },
  };

  constructor() {}

  ngOnInit(): void {
    // Initialize component
    this.loadOrderDetails();
  }

  loadOrderDetails(): void {
    // In a real application, you would fetch order details from a service
    // For now, we're using mock data
    console.log('Loading order details for order:', this.currentOrder.id);
  }

  onAssignDeliveryman(option: DropdownOption): void {
    console.log('Assigning deliveryman:', option);
    // Handle deliveryman assignment logic here
  }

  onPaymentAction(option: DropdownOption): void {
    console.log('Payment action:', option);
    // Handle payment action logic here
  }

  onStatusChange(option: DropdownOption): void {
    console.log('Status change:', option);
    // Handle status change logic here
    this.currentOrder.status = option.label;
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'orange-badge';
      case 'cancelled':
        return 'red-badge';
      case 'preparing':
        return 'lightblue-badge';
      case 'delivered':
        return 'green-badge';
      case 'on the way':
        return 'darkblue-badge';
      default:
        return 'gray-badge';
    }
  }

  formatCurrency(amount: number): string {
    return `₵ ${amount.toFixed(2)}`;
  }

  formatGHCurrency(amount: number): string {
    return `GHC ${amount.toFixed(2)}`;
  }

  onCallCustomer(): void {
    // Handle call customer functionality
    console.log('Calling customer:', this.currentOrder.customer.phone);
  }

  onCallDeliveryGuy(): void {
    // Handle call delivery guy functionality
    if (this.currentOrder.assignedDeliveryGuy) {
      console.log(
        'Calling delivery guy:',
        this.currentOrder.assignedDeliveryGuy.phone
      );
    }
  }

  onViewCustomerProfile(): void {
    // Handle view customer profile functionality
    console.log('Viewing customer profile:', this.currentOrder.customer.id);
  }

  onTrackOrder(): void {
    // Handle order tracking functionality
    console.log('Tracking order:', this.currentOrder.id);
  }

  onUpdateDeliveryTime(): void {
    // Handle delivery time update functionality
    console.log('Updating delivery time for order:', this.currentOrder.id);
  }

  onApplyCopay(): void {
    // Handle copay application
    console.log('Applying copay for order:', this.currentOrder.id);
  }

  onUseRewardPoints(): void {
    // Handle reward points usage
    console.log('Using reward points for order:', this.currentOrder.id);
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
    return this.currentOrder.items.reduce(
      (total, item) => total + item.quantity,
      0
    );
  }

  getItemsText(): string {
    const totalItems = this.getTotalItems();
    return totalItems === 1 ? 'item' : 'items';
  }
}
