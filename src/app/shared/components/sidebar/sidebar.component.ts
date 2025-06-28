import { Component, ElementRef, ViewChild, viewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  @ViewChild('sidebar') sidebar: ElementRef;
  constructor(private authService: AuthService, private router: Router) {}

  logout() {
  this.authService.logout();
  this.router.navigate(['/auth/login']);
}
  closeSidebar() {
    this.sidebar.nativeElement.classList.toggle('hide-sidebar');
    console.log(this.sidebar)
  }
}
