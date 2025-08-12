import { Component, Input, OnDestroy, OnInit, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { OrderTrackingDetails } from '../../../interfaces/order.model';
import { OrderTrackingService } from '../../../shared/services/order-tracking.service';

@Component({
  selector: 'app-order-tracking',
  templateUrl: './order-tracking.component.html',
  styleUrls: ['./order-tracking.component.scss'],
  standalone: false,
})
export class OrderTrackingComponent implements OnInit {
  @Input() orderId!: string;
  hasProfile = signal<boolean>(true);

  orderData?: OrderTrackingDetails;
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
}
