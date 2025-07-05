import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PopupService } from './shared/services/popup.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor(public popupService: PopupService) {}
}
