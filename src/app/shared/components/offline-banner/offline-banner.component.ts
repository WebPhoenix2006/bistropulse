import { Component, computed, inject } from '@angular/core'; // << you import the service here
import { OfflineService } from '../../services/offline-service.service';

@Component({
  selector: 'app-offline-banner',
  standalone: false,
  template: `
    <div *ngIf="isOffline()" class="offline-banner">
      <i class="fa fa-wifi-slash"></i>
      <span>You are offline. Check your internet connection.</span>
    </div>
  `,
  styles: [
    `
      .offline-banner {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        padding: 1rem;
        background-color: rgba(255, 77, 77, 0.81);
        color: white;
        text-align: center;
        font-weight: bold;
        z-index: 1000;
      }
    `,
  ],
})
export class OfflineBannerComponent {
  private offlineService = inject(OfflineService); // using the service
  isOffline = computed(() => this.offlineService.isOffline()); // listen to its signal
}
