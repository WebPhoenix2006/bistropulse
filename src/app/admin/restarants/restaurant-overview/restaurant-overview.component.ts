import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  signal,
  ChangeDetectorRef,
} from '@angular/core';
import { RestaurantService } from '../../../shared/services/restaurant.service';
import { ActivatedRoute } from '@angular/router';
import { Restaurant } from '../../../interfaces/restaurant.interface';
import { BootstrapToastService } from '../../../shared/services/bootstrap-toast.service';
import { SlowNetworkService } from '../../../shared/services/slow-nerwork.service';
import { FastAverageColor } from 'fast-average-color';
import { ImageViewerService } from '../../../shared/services/image-viewer.service';

@Component({
  selector: 'app-restaurant-overview',
  standalone: false,
  templateUrl: './restaurant-overview.component.html',
  styleUrls: ['./restaurant-overview.component.scss'],
})
export class RestaurantOverviewComponent implements OnInit, AfterViewInit {
  constructor(
    private restaurantService: RestaurantService,
    private route: ActivatedRoute,
    private toastr: BootstrapToastService,
    private cdr: ChangeDetectorRef,
    private slowNetwork: SlowNetworkService,
    private imageViewer: ImageViewerService
  ) {}

  @ViewChild('restaurantImg') restaurantImgRef!: ElementRef<HTMLImageElement>;

  // method for opening image
  open(url: string): void {
    this.imageViewer.open(url);
  }

  isLoading = signal<boolean>(false);
  dominantColor = signal<string>('rgba(17, 19, 21, 0.8)');
  restaurant: Restaurant | null = null;
  restaurantId!: string;
  private fac = new FastAverageColor();

  ngOnInit(): void {
    this.isLoading.set(true);
    this.slowNetwork.start(() => {
      if (this.isLoading) {
        this.toastr.showWarning('Hmm this is taking longer than usual');
      }
    });
    this.restaurantId = this.route.snapshot.paramMap.get('id') || '';

    this.restaurantService.getRestaurant(this.restaurantId).subscribe({
      next: (data: Restaurant) => {
        this.toastr.showSuccess('restaurant fetched!');
        this.restaurant = data;
        // console.log(data);
        this.isLoading.set(false);
        this.slowNetwork.clear();
        this.cdr.detectChanges();
        setTimeout(() => this.setupColorExtraction(), 100);
      },
      error: (err) => {
        console.error('FETCH ERROR', err);
        this.toastr.showError('failed to fetch', 2000);
        this.slowNetwork.clear();
        this.isLoading.set(false);
      },
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.setupColorExtraction(), 300);
  }

  setupColorExtraction(): void {
    // If restaurant has no image, skip FAC and set fallback immediately
    if (!this.restaurant?.restaurant_image_url) {
      console.warn('No image URL, applying fallback color');
      this.setFallbackColor();
      return;
    }

    const imgEl = this.restaurantImgRef?.nativeElement;

    if (!imgEl) {
      console.warn('Image element not found');
      return;
    }

    if (imgEl.complete && imgEl.naturalWidth > 0) {
      this.extractColor(imgEl);
    } else {
      imgEl.onload = () => this.extractColor(imgEl);
      imgEl.onerror = () => this.setFallbackColor();

      setTimeout(() => {
        if (imgEl.complete && imgEl.naturalWidth > 0) {
          this.extractColor(imgEl);
        } else {
          this.setFallbackColor();
        }
      }, 3000);
    }
  }

  private extractColor(imgEl: HTMLImageElement): void {
    try {
      const color = this.fac.getColor(imgEl);
      const rgbaColor = color.rgba;

      this.dominantColor.set(rgbaColor);
      this.applyCSSVariables(
        color.value.slice(0, 3) as [number, number, number]
      );
      // console.log(`✅ Color extracted successfully:`, rgbaColor);
    } catch (error) {
      console.error('❌ Color extraction failed:', error);
      this.setFallbackColor();
    }
  }

  private applyCSSVariables([r, g, b]: [number, number, number]): void {
    document.documentElement.style.setProperty(
      '--dominant-color',
      `rgb(${r}, ${g}, ${b})`
    );
    document.documentElement.style.setProperty(
      '--dominant-color-alpha',
      `rgba(${r}, ${g}, ${b}, 0.8)`
    );
  }

  setFallbackColor(): void {
    const fallback = 'rgba(17, 19, 21, 0.8)';
    this.dominantColor.set(fallback);

    const root = document.documentElement;
    root.style.setProperty('--dominant-color', 'rgb(17, 19, 21)');
    root.style.setProperty('--dominant-color-alpha', fallback);
    root.style.setProperty('--dominant-color-light', 'rgba(17, 19, 21, 0.3)');
    root.style.setProperty('--dominant-color-dark', 'rgba(0, 0, 0, 0.9)');
    root.style.setProperty('--complementary-color', 'rgba(100, 100, 100, 0.8)');
  }

  private getComplementaryColor([r, g, b]: [number, number, number]): [
    number,
    number,
    number
  ] {
    return [255 - r, 255 - g, 255 - b];
  }

  refreshColors(): void {
    setTimeout(() => this.setupColorExtraction(), 100);
  }
}
