import {
  Component,
  Input,
  HostListener,
  ElementRef,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { FastAverageColor } from 'fast-average-color';

@Component({
  selector: 'app-image-viewer',
  standalone: false,
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.scss'],
})
export class ImageViewerComponent implements OnDestroy {
  @Input() imageUrl: string | null = null;

  @ViewChild('imgEl') imgEl!: ElementRef<HTMLImageElement>;

  // destroy to free memory
  ngOnDestroy(): void {
    this.fac.destroy();
  }

  // *** initialize the fast average color ***
  private fac = new FastAverageColor();
  dominant: {
    rgba: string;
    hex: string;
    isDark: boolean;
    isLight: boolean;
    value: [number, number, number, number];
  } | null = null;

  // method for waiting till image loads
  async onImageLoad() {
    // return if there isn't and image
    if (!this.imageUrl || !this.imgEl.nativeElement) {
      this.dominant = null;
      return;
    }

    // use fac to get the dominant color
    try {
      const result = await this.fac.getColorAsync(this.imgEl.nativeElement);

      this.dominant = {
        rgba: result.rgba,
        hex: result.hex,
        isDark: result.isDark,
        isLight: result.isLight,
        value: result.value, // [r,g,b,a]
      };
      const [r, g, b] = result?.value;
      const solidColor = this.dominant.hex;
      const transparent = `rgba(${r}, ${g}, ${b}, 0.5)`;
      document.documentElement.style.setProperty('--image-color', transparent);
      document.documentElement.style.setProperty('--solid-color', solidColor);
    } catch (err) {
      this.dominant = null;
    }
  }

  isOpen = false;
  scale = 1;
  translateX = 0;
  translateY = 0;
  isDragging = false;
  lastX = 0;
  lastY = 0;

  open(url: string) {
    this.imageUrl = url;
    this.isOpen = true;
    this.resetView();
  }

  close() {
    this.isOpen = false;
  }

  resetView() {
    this.scale = 1;
    this.translateX = 0;
    this.translateY = 0;
  }

  onWheel(event: WheelEvent) {
    event.preventDefault();
    const zoomIntensity = 0.1;
    this.scale += event.deltaY < 0 ? zoomIntensity : -zoomIntensity;
    this.scale = Math.max(1, Math.min(this.scale, 4)); // clamp between 1x and 4x
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleEscape(event: KeyboardEvent) {
    if (this.isOpen) {
      this.close();
    }
  }

  onMouseDown(event: MouseEvent) {
    if (this.scale > 1) {
      this.isDragging = true;
      this.lastX = event.clientX;
      this.lastY = event.clientY;
    }
  }

  onMouseMove(event: MouseEvent) {
    if (this.isDragging) {
      const dx = event.clientX - this.lastX;
      const dy = event.clientY - this.lastY;
      this.translateX += dx;
      this.translateY += dy;
      this.lastX = event.clientX;
      this.lastY = event.clientY;
    }
  }

  onMouseUp() {
    this.isDragging = false;
  }

  onDoubleClick() {
    this.resetView();
  }
}
