import { Component, Input } from '@angular/core';

@Component({
  selector: 'svg-icons',
  standalone: false,
  templateUrl: './svg-icons.component.html',
  styleUrl: './svg-icons.component.scss',
})
export class SvgIconsComponent {
  @Input() name;

}
