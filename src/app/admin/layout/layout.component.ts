import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  effect,
  EffectRef,
  HostListener,
  Inject,
  inject,
  OnInit,
  OnDestroy,
  PLATFORM_ID,
  signal,
  ChangeDetectorRef,
  DestroyRef,
} from '@angular/core';
import { OfflineService } from '../../shared/services/offline-service.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-layout',
  standalone: false,
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit, OnDestroy {
  private effectRef?: EffectRef;
  isLeftSidebarCollapsed = signal<boolean>(false);
  isSidebarCollapsed = false;
  videoEnded: boolean = false;

  offlineService = inject(OfflineService);
  toastr = inject(ToastrService);
  cdr = inject(ChangeDetectorRef);
  destroyRef = inject(DestroyRef);

  screenWidth = signal<number>(0); // Initialize with 0 or a safe default

  constructor(@Inject(PLATFORM_ID) private platformId: any) {
    this.effectRef = effect(() => {
      if (this.offlineService.isOffline()) {
        this.videoEnded = false;
        this.toastr.error(
          'No internet connection. Waiting to reconnect...',
          'Error',
          {
            timeOut: 0,
            extendedTimeOut: 0,
            closeButton: true,
            disableTimeOut: true,
          }
        );
      }
      this.cdr.markForCheck();
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.screenWidth.set(window.innerWidth);

      // ✅ Create effect WITHIN injection context
    }
  }

  ngOnDestroy(): void {
    this.effectRef?.destroy();
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
