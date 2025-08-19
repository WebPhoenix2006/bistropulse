import { Component, OnInit, signal } from '@angular/core';
import { AddOrderService } from '../../../shared/services/add-order.service';
import { SlowNetworkService } from '../../../shared/services/slow-nerwork.service';
import { BootstrapToastService } from '../../../shared/services/bootstrap-toast.service';
import { ActivatedRoute } from '@angular/router';
import { FilterByPipe } from '../../../shared/pipes/filter.pipe';

interface Food {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  extras: any[];
  category: number;
  categoryName: string;
  available: boolean;
  sizes: {
    smallPrice: string | null;
    mediumPrice: string | null;
    largePrice: string | null;
  };
  restaurant: string;
}

interface CartItem extends Food {
  quantity: number;
  selectedSize?: 'small' | 'medium' | 'large';
}

@Component({
  selector: 'app-add-order',
  standalone: false,
  templateUrl: './add-order.component.html',
  styleUrl: './add-order.component.scss',
  providers: [FilterByPipe],
})
export class AddOrderComponent implements OnInit {
  foods: Food[] = [];
  cart: CartItem[] = [];
  restaurantId: string = '';
  isLoading = signal<boolean>(false);
  activeTab = signal<string>('foods');

  // Group foods by category
  get groupedFoods() {
    const groups: { [key: string]: Food[] } = {};
    this.foods.forEach((food) => {
      if (!groups[food.categoryName]) {
        groups[food.categoryName] = [];
      }
      groups[food.categoryName].push(food);
    });
    return groups;
  }

  // Get total items in cart
  get cartItemCount() {
    return this.cart.reduce((total, item) => total + item.quantity, 0);
  }

  // Get total cart value
  get cartTotal() {
    return this.cart.reduce((total, item) => {
      const price = parseFloat(item.price) || 0;
      return total + price * item.quantity;
    }, 0);
  }

  constructor(
    private orderService: AddOrderService,
    private slowNetwork: SlowNetworkService,
    private toastr: BootstrapToastService,
    private activeRoute: ActivatedRoute
  ) {}

  // Helper method for template to get object keys
  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  // Handle image loading errors
  onImageError(event: any): void {
    event.target.src = 'assets/images/food-placeholder.jpg'; // fallback image
  }

  getFoods(): void {
    this.isLoading.set(true);
    this.orderService.getFoods(this.restaurantId).subscribe({
      next: (data: any) => {
        this.foods = data.results || [];
        this.isLoading.set(false);
        console.log('Foods loaded:', this.foods);
      },
      error: (err) => {
        this.isLoading.set(false);
        console.log(err);
        this.toastr.showError(err.message || 'failed to get foods');
      },
    });
  }

  addToCart(food: Food): void {
    if (!food.available) {
      this.toastr.showError('This item is currently unavailable');
      return;
    }

    const existingItem = this.cart.find((item) => item.id === food.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.cart.push({
        ...food,
        quantity: 1,
      });
    }

    this.toastr.showSuccess(`${food.name} added to cart`);
    console.log('Cart updated:', this.cart);
  }

  removeFromCart(foodId: number): void {
    const itemIndex = this.cart.findIndex((item) => item.id === foodId);
    if (itemIndex > -1) {
      const removedItem = this.cart[itemIndex];
      this.cart.splice(itemIndex, 1);
      this.toastr.showSuccess(`${removedItem.name} removed from cart`);
      console.log('Item removed from cart:', this.cart);
    }
  }

  updateQuantity(foodId: number, quantity: number): void {
    const item = this.cart.find((item) => item.id === foodId);
    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(foodId);
      } else {
        item.quantity = quantity;
        console.log('Quantity updated:', this.cart);
      }
    }
  }

  switchTab(tab: string): void {
    this.activeTab.set(tab);
  }

  placeOrder(): void {
    if (this.cart.length === 0) {
      this.toastr.showError('Your cart is empty');
      return;
    }

    // Generate order ID (similar to your example)
    const orderId = 'BO' + Math.floor(Math.random() * 10000000);

    // Calculate totals
    const subtotal = this.cartTotal;
    const deliveryFee = 50.0;
    const platformFee = 10.0;
    const tax = 5.0;
    const grandTotal = subtotal + deliveryFee + platformFee + tax;

    // Create comprehensive order data similar to your example structure
    const orderData = {
      order_id: orderId,
      restaurant: this.restaurantId,
      branch: null,

      // Order items
      items: this.cart.map((item) => ({
        food_id: item.id,
        food_name: item.name,
        quantity: item.quantity,
        unit_price: parseFloat(item.price),
        total_price: parseFloat(item.price) * item.quantity,
        category: item.categoryName,
        selectedSize: item.selectedSize || null,
        extras: item.extras || [],
      })),

      // Pricing breakdown
      pricing: {
        subtotal: subtotal,
        delivery_fee: deliveryFee,
        platform_fee: platformFee,
        tax: tax,
        total: grandTotal,
      },

      // Order details
      order_details: {
        item_count: this.cartItemCount,
        total_quantity: this.cart.reduce((sum, item) => sum + item.quantity, 0),
        date_ordered: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
        payment_method: 'Cash in hand', // Default, can be made dynamic
        payment_status: 'Pending',
        status: 'Pending',
      },

      // Customer info (you might want to get this from a service)
      customer: {
        // This would typically come from your auth service
        customer_id: 'user_' + Math.floor(Math.random() * 1000000),
        location: 'Customer Location', // Get from user service
      },

      // Location data (you might want to get this from geolocation)
      pickup_location: {
        lat: 6.5244, // Lagos coordinates as example
        lng: 3.3792,
      },
      dropoff_location: {
        lat: 6.5244, // This would be customer's location
        lng: 3.3792,
      },

      // Timestamps
      created_at: new Date().toISOString(),
      estimated_delivery_time: new Date(Date.now() + 45 * 60000).toISOString(), // 45 minutes from now
    };

    // Console log the complete order data
    console.log('🔍 Complete Order Data:', orderData);
    console.log('📦 Order Summary:', {
      orderId: orderData.order_id,
      restaurant: orderData.restaurant,
      itemCount: orderData.order_details.item_count,
      subtotal: orderData.pricing.subtotal,
      total: orderData.pricing.total,
      items: orderData.items.map(
        (item) => `${item.food_name} x${item.quantity}`
      ),
    });

    // Show success message
    this.toastr.showSuccess(`Order ${orderId} placed successfully!`);

    // Clear cart after order
    this.cart = [];

    // Switch to foods tab
    this.switchTab('foods');
  }

  ngOnInit(): void {
    const id = this.activeRoute.snapshot.paramMap.get('id');
    this.restaurantId = id || '';
    this.getFoods();
  }
}
