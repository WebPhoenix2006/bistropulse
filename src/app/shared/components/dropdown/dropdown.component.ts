import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-dropdown',
  standalone: false,
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss',
})
export class DropdownComponent {
  @Input() options: {
    label: string;
    value: any;
    icon: string;
    iconPosition: string;
  }[] = [];
  @Input() ellipsis: boolean = false;
  @Input() placeholder: string = 'Select option';

  @Output() selected = new EventEmitter<any>();

  isOpen = false;

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  selectOption(option: any) {
    this.selected.emit(option);
    this.isOpen = false;
  }

  closeDropdown() {
    this.isOpen = false;
  }
}
