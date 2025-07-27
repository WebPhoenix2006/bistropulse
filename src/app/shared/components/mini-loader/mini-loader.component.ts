import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-mini-loader',
  standalone: false,
  templateUrl: './mini-loader.component.html',
  styleUrl: './mini-loader.component.scss',
})
export class MiniLoaderComponent {
  @Input() loadingText?: string; // Optional loading text
}
