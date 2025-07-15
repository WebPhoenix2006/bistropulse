import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-modal',
  standalone: false,
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-in', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('200ms ease-out', style({ opacity: 0 }))]),
    ]),
    trigger('scaleInOut', [
      transition(':enter', [
        style({ transform: 'scale(0.8)', opacity: 0 }),
        animate('200ms ease-in', style({ transform: 'scale(1)', opacity: 1 })),
      ]),
      transition(':leave', [
        animate(
          '200ms ease-out',
          style({ transform: 'scale(0.8)', opacity: 0 })
        ),
      ]),
    ]),
  ],
})
export class ModalComponent {
  @Input() isVisible: boolean = false;
  @Output() isVisibleChange = new EventEmitter<boolean>();

  // Allows size customisation
  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  // Closes modal and emits change
  close() {
    this.isVisible = false;
    this.isVisibleChange.emit(false);
  }
  // Close when the backdrop is clicked
  onBackdropClick() {
    this.close();
  }
  // Close when escape key is pressed
  @HostListener('document:keydown.escape', ['$event'])
  handleEscape(event: KeyboardEvent) {
    if (this.isVisible) {
      this.close;
    }
  }
}
