import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-signup',
  standalone: false,
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  @ViewChild('password') password: ElementRef;

  showPass(event: Event) {
  const checkbox = event.target as HTMLInputElement;
  this.password.nativeElement.type = checkbox.checked ? 'text' : 'password';
}
}
