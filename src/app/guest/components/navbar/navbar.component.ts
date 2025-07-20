import { Component } from '@angular/core';

@Component({
  selector: 'navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  navigationItems = [
    { label: 'Home', route: '/guest/home' },
    { label: 'About Us', route: '/guest/about-us' },
    { label: 'Features', route: '/guest/features' },
    { label: 'Testimonials', route: '/guest/testimonials' },
    { label: 'Integrations', route: '/guest/integrations' },
    { label: 'Pricing', route: '/guest/pricing' },
  ];
}
