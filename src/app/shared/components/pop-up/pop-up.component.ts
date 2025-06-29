import {
  Component,
  Input,
  signal,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-pop-up',
  standalone: false,
  templateUrl: './pop-up.component.html',
  styleUrl: './pop-up.component.scss',
})
export class PopUpComponent implements OnChanges {
  @Input() messageText = 'Success ✅';
  @Input() visible = false;

  isVisible = signal(false);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible']?.currentValue === true) {
      this.isVisible.set(true);
      setTimeout(() => this.isVisible.set(false), 3000);
    }
  }
}
