import { Component } from '@angular/core';

@Component({
  selector: 'navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  navigationItems = [
    { label: 'About Us', route: '/about-us' },
    { label: 'Features', route: '/features' },
    { label: 'Testimonials', route: '/testimonials' },
    { label: 'Integrations', route: '/integrations' },
    { label: 'Pricing', route: '/pricing' },
  ];
}
