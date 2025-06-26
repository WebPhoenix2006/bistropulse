import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'cus-tab',
  standalone:false,
  templateUrl: './tab.component.html',
  styleUrl: './tab.component.scss'
})
export class TabComponent {
   @Input() label = '';
  active = false;

 
}
