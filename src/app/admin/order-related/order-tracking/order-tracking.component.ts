import {
  Component,
  Input,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { OrderTrackingService } from '../../../shared/services/order-tracking.service';
import { OrderItem } from '../../../interfaces/order.interface';

@Component({
  selector: 'app-order-tracking',
  templateUrl: './order-tracking.component.html',
  styleUrls: ['./order-tracking.component.scss'],
  standalone: false,
})
export class OrderTrackingComponent implements OnInit, OnDestroy {
  @Input() orderId!: string;
  orderData?: OrderItem;
  private subscription?: Subscription;

  constructor(private trackingService: OrderTrackingService) {}

  ngOnInit(): void {
    if (!this.orderId) return;

    console.log('🔄 Connecting to order:', this.orderId);

    this.trackingService.connect(this.orderId);
    this.subscription = this.trackingService.getUpdates().subscribe({
      next: (data) => {
        console.log('✅ Order update received:', data);
        this.orderData = data;
      },
      error: (err) => {
        console.error('❌ WebSocket error:', err);
      },
    });
  }

  ngOnDestroy(): void {
    console.log('🛑 Destroying order tracking component');
    this.trackingService.disconnect();
    this.subscription?.unsubscribe();
  }
}
