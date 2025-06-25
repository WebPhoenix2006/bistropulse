import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tooltip',
  standalone: false,
  templateUrl: './tooltip.component.html',
  styleUrl: './tooltip.component.scss',
})
export class TooltipComponent {
   @Input() label: string = '';
  @Input() value: string | number = '';
}
