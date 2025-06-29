import { Component, input, output } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  isLeftSidebarCollapsed = input.required<boolean>();
  sidebarCollapse = output<boolean>();

  constructor(private authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  openSidebar() {
    this.sidebarCollapse.emit(false);
  }

  collapseSidebar(): void {
    this.sidebarCollapse.emit(true);
  }
}
