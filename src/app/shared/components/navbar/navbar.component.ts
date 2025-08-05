import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  ElementRef,
  Renderer2,
} from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: false,
})
export class NavbarComponent implements OnInit, OnDestroy {
  // State
  isLoading = false;

  // Notification counts
  chatNotificationCount = 0;
  notificationCount = 0;

  // Subscriptions
  private subscriptions: Subscription[] = [];

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.loadNotificationCounts();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  /**
   * Handle window resize events
   */
  @HostListener('window:resize', ['$event'])
  onWindowResize(): void {
    // You can keep this if you want to recalculate something based on viewport
  }

  /**
   * Load notification counts from services
   */
  private loadNotificationCounts(): void {
    // Replace with real service calls later
    setTimeout(() => {
      this.chatNotificationCount = 3;
      this.notificationCount = 7;
      this.updateNotificationBadges();
    }, 1000);
  }

  /**
   * Update notification badges on DOM elements
   */
  private updateNotificationBadges(): void {
    const chatElement = this.elementRef.nativeElement.querySelector('.chats');
    const notificationElement =
      this.elementRef.nativeElement.querySelector('.notifications');

    if (chatElement) {
      this.renderer.setAttribute(
        chatElement,
        'data-count',
        this.chatNotificationCount.toString()
      );
    }

    if (notificationElement) {
      this.renderer.setAttribute(
        notificationElement,
        'data-count',
        this.notificationCount.toString()
      );
    }
  }

  /**
   * Handle chat navigation with loading state
   */
  onChatClick(): void {
    this.setLoadingState(true);
    setTimeout(() => {
      this.setLoadingState(false);
    }, 500);
  }

  /**
   * Handle notifications click
   */
  onNotificationsClick(): void {
    this.setLoadingState(true);
    console.log('Opening notifications...');
    setTimeout(() => {
      this.setLoadingState(false);
    }, 300);
  }

  /**
   * Handle profile click
   */
  onProfileClick(): void {
    console.log('Opening profile menu...');
    this.toggleProfileDropdown();
  }

  /**
   * Toggle profile dropdown menu
   */
  private toggleProfileDropdown(): void {
    console.log('Toggling profile dropdown');
  }

  /**
   * Set loading state for navbar
   */
  private setLoadingState(loading: boolean): void {
    this.isLoading = loading;
  }

  /**
   * Smooth scroll to top when navbar logo is clicked
   */
  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  /**
   * Get notification count display text
   */
  getNotificationDisplayCount(count: number): string {
    if (count === 0) return '0';
    if (count > 99) return '99+';
    return count.toString();
  }

  /**
   * Mark notifications as read
   */
  markNotificationsAsRead(type: 'chat' | 'notification'): void {
    if (type === 'chat') {
      this.chatNotificationCount = 0;
    } else {
      this.notificationCount = 0;
    }
    this.updateNotificationBadges();
  }

  /**
   * Check if user is online (for status indicator)
   */
  get isUserOnline(): boolean {
    return true; // Always online for now
  }

  /**
   * Get user avatar URL
   */
  get userAvatarUrl(): string {
    return 'assets/images/profile-img.png';
  }

  /**
   * Handle keyboard navigation
   */
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.closeAllDropdowns();
    }
  }

  /**
   * Close all open dropdowns
   */
  private closeAllDropdowns(): void {
    console.log('Closing all dropdowns');
  }
}
