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
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { OfflineService } from '../../shared/services/offline-service.service';
import { ToastrService } from 'ngx-toastr';
import { RouterOutlet } from '@angular/router';
import { routeAnimations } from '../../shared/animation/animations.service';
import { ImageViewerService } from '../../shared/services/image-viewer.service';
import { ImageViewerComponent } from '../../shared/components/image-viewer/image-viewer.component';

@Component({
  selector: 'app-layout',
  standalone: false,
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  animations: [routeAnimations],
})
export class LayoutComponent implements OnInit, OnDestroy, AfterViewInit {
  private effectRef?: EffectRef;
  isLeftSidebarCollapsed = signal<boolean>(false);
  isSidebarCollapsed = false;
  videoEnded: boolean = false;

  offlineService = inject(OfflineService);
  toastr = inject(ToastrService);
  cdr = inject(ChangeDetectorRef);
  destroyRef = inject(DestroyRef);
  viewerService = inject(ImageViewerService);

  screenWidth = signal<number>(0); // Initialize with 0 or a safe default

  // *** LOGIC FOR USING THE IMAGE VIEWER ***
  @ViewChild('globalViewer') globalViewer!: ImageViewerComponent;

  ngAfterViewInit(): void {
    this.viewerService.register(this.globalViewer);
  }

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
    // this.handleInitialNavbarState(); // Apply navbar-fixed on load if page is already scrolled
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

  // @ViewChild('navbar', { static: true }) navbar!: ElementRef;

  //private scrollThreshold = 10; // 👈 Adds tolerance to avoid micro-scroll flicker

  // @HostListener('window:scroll')
  // onScroll() {
  //   this.updateNavbarFixedState();
  // }

  // private updateNavbarFixedState(): void {
  //   if (!this.navbar) return;

  //   const scrollY = window.scrollY || window.pageYOffset;

  //   if (scrollY > this.scrollThreshold) {
  //     this.navbar.nativeElement.classList.add('navbar-fixed');
  //   } else {
  //     this.navbar.nativeElement.classList.remove('navbar-fixed');
  //   }
  // }

  // private handleInitialNavbarState(): void {
  //   setTimeout(() => this.updateNavbarFixedState(), 10);
  // }

  changeSidebarState(state: boolean): void {
    this.isLeftSidebarCollapsed.set(state);
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet?.activatedRouteData?.['animation'];
  }
}
