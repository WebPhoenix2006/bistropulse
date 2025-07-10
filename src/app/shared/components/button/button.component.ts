import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  standalone: false,
})
export class ButtonComponent {
  @Input() buttonText: string = 'default text';

  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  @Input() color: 'primary' | 'secondary' | 'danger' | 'success' = 'primary';

  @Input() buttonType: 'button' | 'submit' = 'button';
}
