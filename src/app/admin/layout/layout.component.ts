import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  effect,
  HostListener,
  Inject,
  inject,
  OnInit,
  PLATFORM_ID,
  runInInjectionContext,
  signal,
} from '@angular/core';
import { OfflineService } from '../../shared/services/offline-service.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-layout',
  standalone: false,
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  isLeftSidebarCollapsed = signal<boolean>(false);
  isSidebarCollapsed = false;
  videoEnded: boolean = false;

  offlineService = inject(OfflineService);
  toastr = inject(ToastrService);

  screenWidth = signal<number>(0); // Initialize with 0 or a safe default

  constructor(@Inject(PLATFORM_ID) private platformId: any) {
    if (isPlatformBrowser(this.platformId)) {
      effect(() => {
        const isOffline = this.offlineService.isOffline();
        if (isOffline) {
          this.videoEnded = false;
          this.toastr.error(
            'No internet connection. Waiting to reconnect...',
            'Error',
            {
              timeOut: 0, // no auto close
              extendedTimeOut: 0, // no hover delay
              closeButton: true, // optional: add close button
              disableTimeOut: true, // ✅ prevent auto-dismiss completely
            }
          );
        }
      });
    }
  }

  // ✅ This was wrongly placed outside before
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.screenWidth.set(window.innerWidth);
      const isMobile = window.innerWidth < 768;
      // Add more logic if needed
    }
  }

  get layoutClass() {
    return {
      'sidebar-collapsed': this.isSidebarCollapsed,
    };
  }

  @HostListener('window:resize')
  onResize() {
    this.screenWidth.set(window.innerWidth);
    if (this.screenWidth() > 768) {
      this.isLeftSidebarCollapsed.set(true);
    }
  }

  changeSidebarState(state: boolean): void {
    this.isLeftSidebarCollapsed.set(state);
  }
}
