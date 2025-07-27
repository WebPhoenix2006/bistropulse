import { Component } from '@angular/core';
import { fadeInOut, fadeInStagger, slideInOut } from '../../animation/animations.service';

@Component({
  selector: 'app-animate',
  standalone: false,
  templateUrl: './animate.component.html',
  styleUrl: './animate.component.scss',
  animations: [fadeInOut, fadeInStagger, slideInOut],
})
export class AnimateComponent {

}
