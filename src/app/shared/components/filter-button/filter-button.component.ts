import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'app-filter-button',
  standalone: false,
  templateUrl: './filter-button.component.html',
  styleUrl: './filter-button.component.scss',
})
export class FilterButtonComponent {
  isOpen = signal(false);

  text = input<string>('Default text');

  toggle() {
    this.isOpen.set(!this.isOpen());
  }

  close() {
    this.isOpen.set(false);
  }

  clearFilter() {
    console.log('Filter cleared inside reusable component');
    // Add actual logic here
  }

  applyFilter() {
    console.log('Filter applied inside reusable component');
    // Add actual logic here
  }
}
