import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SIDEBAR_ITEMS, SidebarItem } from './sidebar.config';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  @Input() isSidebarCollapsed!: boolean; // ✅ FIXED: Add this Input
  @Output() sidebarCollapse = new EventEmitter<boolean>();

  sidebarItems: SidebarItem[] = [];

  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void {
    const role = this.authService.getUserRole() || 'admin'; // Fallback default
    this.sidebarItems = SIDEBAR_ITEMS.filter(
      (item) => !item.roles || item.roles.includes(role)
    );
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  openSidebar() {
    this.sidebarCollapse.emit(false);
  }

  collapseSidebar() {
    this.sidebarCollapse.emit(true);
  }
}
