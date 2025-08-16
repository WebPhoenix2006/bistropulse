import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http'; // 🔹 Added HttpHeaders
import { Observable, Subject, BehaviorSubject, filter } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { enviroment } from '../../../environments/environment';
import { Order } from '../../interfaces/order.interface';

@Injectable({
  providedIn: 'root',
})
export class OrderTrackingService {
  private socket$?: WebSocketSubject<any>;
  private orderUpdates$ = new BehaviorSubject<Order | null>(null);

  private connectionStatus$ = new BehaviorSubject<boolean>(false);
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 3000; // 3 seconds

  // 🔹 Add your token here
  private token = 'c334c555d440ad54c0fab3b2ada8177186e37297';
  private httpOptions = {
    headers: new HttpHeaders({
      Authorization: `Token ${this.token}`,
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) {}

  async getOrderDetails(restaurantId: string, orderId: string): Promise<Order> {
    try {
      const url = `${enviroment.apiUrl}/restaurants/${restaurantId}/orders/${orderId}/`;
      const response = await this.http
        .get<Order>(url, this.httpOptions)
        .toPromise(); // 🔹 Added httpOptions

      if (!response) throw new Error('No data received from API');
      console.log('✅ Order details loaded:', response);
      return response;
    } catch (error) {
      console.error('❌ Failed to load order details:', error);
      throw error;
    }
  }

  async updateOrder(
    restaurantId: string,
    orderId: string,
    orderData: Partial<Order>
  ): Promise<Order> {
    try {
      const url = `${enviroment.apiUrl}/restaurants/${restaurantId}/orders/${orderId}/`;
      const response = await this.http
        .put<Order>(url, orderData, this.httpOptions)
        .toPromise(); // 🔹

      if (!response) throw new Error('No data received from API');
      console.log('✅ Order updated successfully:', response);
      return response;
    } catch (error) {
      console.error('❌ Failed to update order:', error);
      throw error;
    }
  }

  connect(orderId: string): void {
    if (this.socket$ && !this.socket$.closed) {
      console.log('🔗 WebSocket already connected');
      return;
    }

    const wsUrl = `${enviroment.wsUrl.replace(/\/+$/, '')}/orders/${orderId}/`;
    console.log('🔌 Connecting to WebSocket:', wsUrl);

    this.socket$ = webSocket({
      url: wsUrl,
      openObserver: {
        next: () => {
          console.log('✅ WebSocket connected successfully');
          this.connectionStatus$.next(true);
          this.reconnectAttempts = 0;
        },
      },
      closeObserver: {
        next: (closeEvent) => {
          console.log('🔌 WebSocket connection closed:', closeEvent);
          this.connectionStatus$.next(false);
          this.handleReconnection(orderId);
        },
      },
    });

    this.socket$.subscribe({
      next: (data: Order) => {
        console.log('📨 WebSocket message received:', data);
        this.orderUpdates$.next(data);
      },
      error: (error) => {
        console.error('❌ WebSocket error:', error);
        this.connectionStatus$.next(false);
        this.handleReconnection(orderId);
      },
    });
  }

  private handleReconnection(orderId: string): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(
        `🔄 Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`
      );
      setTimeout(() => {
        this.connect(orderId);
      }, this.reconnectInterval * this.reconnectAttempts);
    } else {
      console.error(
        '❌ Max reconnection attempts reached. Please refresh the page.'
      );
    }
  }

  getUpdates(): Observable<Order> {
    return this.orderUpdates$
      .asObservable()
      .pipe(filter((data): data is Order => data !== null));
  }

  getConnectionStatus(): Observable<boolean> {
    return this.connectionStatus$.asObservable();
  }

  sendMessage(message: any): void {
    if (this.socket$ && !this.socket$.closed) {
      this.socket$.next(message);
      console.log('📤 Message sent:', message);
    } else {
      console.error('❌ WebSocket is not connected');
    }
  }

  async updateOrderStatus(
    restaurantId: string,
    orderId: string,
    status: string
  ): Promise<Order> {
    return await this.updateOrder(restaurantId, orderId, { status });
  }

  async assignRider(
    restaurantId: string,
    orderId: string,
    riderCode: string
  ): Promise<Order> {
    return await this.updateOrder(restaurantId, orderId, {
      rider_code: riderCode,
    });
  }

  async updateLocation(
    restaurantId: string,
    orderId: string,
    location: { lat: number; lng: number }
  ): Promise<Order> {
    return await this.updateOrder(restaurantId, orderId, {
      current_location: location,
    });
  }

  async updatePaymentStatus(
    restaurantId: string,
    orderId: string,
    paymentStatus: string
  ): Promise<Order> {
    return await this.updateOrder(restaurantId, orderId, {
      payment_status: paymentStatus,
    });
  }

  disconnect(): void {
    if (this.socket$) {
      console.log('🔌 Disconnecting WebSocket...');
      this.socket$.complete();
      this.connectionStatus$.next(false);
    }
  }

  getRestaurantOrders(restaurantId: string): Observable<Order[]> {
    const url = `${enviroment.apiUrl}/restaurants/${restaurantId}/orders/`;
    return this.http.get<Order[]>(url, this.httpOptions); // 🔹
  }

  async createOrder(restaurantId: string, orderData: any): Promise<Order> {
    try {
      const url = `${enviroment.apiUrl}/restaurants/${restaurantId}/orders/`;
      const response = await this.http
        .post<Order>(url, orderData, this.httpOptions)
        .toPromise(); // 🔹
      if (!response) throw new Error('No data received from API');
      console.log('✅ Order created successfully:', response);
      return response;
    } catch (error) {
      console.error('❌ Failed to create order:', error);
      throw error;
    }
  }

  async deleteOrder(restaurantId: string, orderId: string): Promise<void> {
    try {
      const url = `${enviroment.apiUrl}/restaurants/${restaurantId}/orders/${orderId}/`;
      await this.http.delete(url, this.httpOptions).toPromise(); // 🔹
      console.log('✅ Order deleted successfully');
    } catch (error) {
      console.error('❌ Failed to delete order:', error);
      throw error;
    }
  }
}
