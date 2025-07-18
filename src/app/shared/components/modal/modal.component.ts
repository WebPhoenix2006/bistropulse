import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  standalone: false,
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-in', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('200ms ease-out', style({ opacity: 0 })),
      ]),
    ]),
    trigger('scaleInOut', [
      transition(':enter', [
        style({ transform: 'scale(0.8)', opacity: 0 }),
        animate('200ms ease-in', style({ transform: 'scale(1)', opacity: 1 })),
      ]),
      transition(':leave', [
        animate('200ms ease-out', style({ transform: 'scale(0.8)', opacity: 0 })),
      ]),
    ]),
  ],
})
export class ModalComponent {
  // Unique identifier for the modal
  @Input() id!: string;

  // Shared modal ID state from parent
  @Input() activeModalId!: string | null;
  @Output() activeModalIdChange = new EventEmitter<string | null>();

  // Modal size options
  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  // Modal is visible if its ID matches the active one
  get isVisible(): boolean {
    return this.id === this.activeModalId;
  }

  // Close modal
  close() {
    this.activeModalIdChange.emit(null);
  }

  // Close on backdrop click
  onBackdropClick() {
    this.close();
  }

  // Close on Escape key
  @HostListener('document:keydown.escape', ['$event'])
  handleEscape(event: KeyboardEvent) {
    if (this.isVisible) {
      this.close();
    }
  }
}
