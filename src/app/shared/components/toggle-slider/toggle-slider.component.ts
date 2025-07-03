import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'toggle-switch',
  standalone: false,
  templateUrl: './toggle-slider.component.html',
  styleUrl: './toggle-slider.component.scss',
})
export class ToggleSliderComponent {
  @Input() checked: boolean = false;
  @Input() disabled: boolean = false;
  @Output() toggled = new EventEmitter<boolean>();

  toggle() {
    if (!this.disabled) {
      this.checked = !this.checked;
      this.toggled.emit(this.checked);
    }
  }
}
