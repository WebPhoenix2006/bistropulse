import { Component, signal } from '@angular/core';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [ButtonComponent, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  passwordVisible = signal<boolean>(false);
}
