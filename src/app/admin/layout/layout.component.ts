import { isPlatformBrowser } from '@angular/common';
import { Component, HostListener, Inject, OnInit, PLATFORM_ID, signal } from '@angular/core';

@Component({
  selector: 'app-layout',
  standalone: false,
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent implements OnInit {
  isLeftSidebarCollapsed = signal<boolean>(false);
  isSidebarCollapsed = false;

  screenWidth = signal<number>(0); // Initialize with 0 or a safe default

  constructor(@Inject(PLATFORM_ID) private platformId: any) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.screenWidth.set(window.innerWidth);
      const isMobile = window.innerWidth < 768;
      // Do DOM-related logic here
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
