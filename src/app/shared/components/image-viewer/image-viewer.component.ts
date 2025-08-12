import { Component, Input, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image-viewer',
  standalone: false,
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.scss'],
})
export class ImageViewerComponent {
  @Input() imageUrl: string | null = null;

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
