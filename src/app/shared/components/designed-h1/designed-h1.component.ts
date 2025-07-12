import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-h1',
  standalone: false,
  templateUrl: './designed-h1.component.html',
  styleUrl: './designed-h1.component.scss',
})
export class DesignedH1Component {
  @Input() text: string = 'Default Heading';
}
