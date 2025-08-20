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
    action?: () => void;
  }[] = [];
  @Input() ellipsis: boolean = false;
  @Input() placeholder: string = '';

  @Output() selected = new EventEmitter<any>();

  isOpen = false;

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  selectOption(option: any) {
    this.selected.emit(option);
    if(option.action && typeof option.action === 'function'){
      option.action();
    }
    this.isOpen = false;
  }

  closeDropdown() {
    this.isOpen = false;
  }
}
