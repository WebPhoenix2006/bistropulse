import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { Order, OrderItem } from '../../interfaces/order.interface';

@Injectable({
  providedIn: 'root',
})
export class OrderTrackingService {
  private socket?: WebSocket;
  private updates$ = new ReplaySubject<OrderItem>(1);
  private BASE_URL: string =
    'wss://bistropulse-backend.onrender.com/ws/orders/';

  private resetStream(): void {
    this.updates$ = new ReplaySubject<OrderItem>(1);
  }

  connect(orderId: string): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.close();
    }

    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const host =
      window.location.hostname === 'localhost'
        ? '127.0.0.1:8000'
        : window.location.host;

    const url = `${protocol}://${this.BASE_URL}${orderId}/`;
    console.log('[WebSocket] Connecting to:', url);

    this.resetStream();
    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      console.log('[WebSocket] ✅ Connected to', url);
    };

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('[WebSocket] 📩 Message:', data);
        this.updates$.next(data);
      } catch (err) {
        console.error('[WebSocket] ❌ Error parsing WebSocket message:', err);
      }
    };

    this.socket.onclose = (event) => {
      console.warn('[WebSocket] ⚠️ Closed:', event.reason || event.code);
    };

    this.socket.onerror = (error) => {
      console.error('[WebSocket] ❌ Socket error:', error);
    };
  }

  getUpdates(): Observable<OrderItem> {
    return this.updates$.asObservable();
  }

  disconnect(): void {
    if (this.socket) {
      console.log('[WebSocket] 🔌 Disconnecting...');
      this.socket.close();
      this.socket = undefined;
    }
    this.resetStream();
  }
}
