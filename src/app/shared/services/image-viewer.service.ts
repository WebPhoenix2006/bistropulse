import { Injectable } from '@angular/core';
import { ImageViewerComponent } from '../components/image-viewer/image-viewer.component';

@Injectable({ providedIn: 'root' })
export class ImageViewerService {
  private viewer!: ImageViewerComponent;

  register(viewer: ImageViewerComponent) {
    this.viewer = viewer;
  }

  open(url: string) {
    if (this.viewer) {
      this.viewer.open(url);
    }
  }
}
