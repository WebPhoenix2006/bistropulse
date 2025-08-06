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
import ColorThief from 'color-thief-browser';
import { SlowNetworkService } from '../../../shared/services/slow-nerwork.service';

@Component({
  selector: 'app-restaurant-overview',
  standalone: false,
  templateUrl: './restaurant-overview.component.html',
  styleUrl: './restaurant-overview.component.scss',
})
export class RestaurantOverviewComponent implements OnInit, AfterViewInit {
  constructor(
    private restaurantService: RestaurantService,
    private route: ActivatedRoute,
    private toastr: BootstrapToastService,
    private cdr: ChangeDetectorRef,
    private slowNetwork: SlowNetworkService
  ) {}

  @ViewChild('restaurantImg') restaurantImgRef!: ElementRef<HTMLImageElement>;

  isLoading = signal<boolean>(false);
  dominantColor = signal<string>('rgba(17, 19, 21, 0.8)'); // fallback color
  restaurant: Restaurant | null = null;
  restaurantId!: string;
  private colorThief = new ColorThief();

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
        this.isLoading.set(false);
        this.slowNetwork.clear();
        // Trigger color extraction after restaurant data is loaded
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
    // Additional safety net for color extraction
    setTimeout(() => this.setupColorExtraction(), 300);
  }

  setupColorExtraction(): void {
    const imgEl = this.restaurantImgRef?.nativeElement;

    if (!imgEl) {
      console.warn('Image element not found');
      return;
    }

    // Clear any existing event handlers
    imgEl.onload = null;
    imgEl.onerror = null;

    // Set up error handling
    imgEl.onerror = () => {
      console.warn('Image failed to load, using fallback color');
      this.setFallbackColor();
    };

    // Check if image is already loaded
    if (imgEl.complete && imgEl.naturalWidth > 0) {
      this.extractColor(imgEl);
    } else {
      // Wait for image to load
      imgEl.onload = () => {
        this.extractColor(imgEl);
      };

      // Fallback timeout in case onload never fires
      setTimeout(() => {
        if (imgEl.complete && imgEl.naturalWidth > 0) {
          this.extractColor(imgEl);
        } else {
          console.warn('Image load timeout, using fallback');
          this.setFallbackColor();
        }
      }, 3000);
    }
  }

  private extractColor(imgEl: HTMLImageElement): void {
    try {
      // Double-check image is ready
      if (!imgEl.complete || imgEl.naturalWidth === 0) {
        console.warn('Image not ready for color extraction');
        this.setFallbackColor();
        return;
      }

      // Extract dominant color
      const color = this.colorThief.getColor(imgEl);
      const rgbColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
      const rgbaColor = `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.8)`;

      // Update the signal
      this.dominantColor.set(rgbaColor);

      // Apply CSS custom properties for dynamic styling
      this.applyCSSVariables(color as [number, number, number]);

      console.log('✅ Color extracted successfully:', rgbColor);
    } catch (error) {
      console.error('❌ ColorThief extraction failed:', error);
      this.setFallbackColor();
    }
  }

  private applyCSSVariables(color: [number, number, number]): void {
    const root = document.documentElement;
    const [r, g, b] = color;

    // Set various color variations
    root.style.setProperty('--dominant-color', `rgb(${r}, ${g}, ${b})`);
    root.style.setProperty(
      '--dominant-color-alpha',
      `rgba(${r}, ${g}, ${b}, 0.8)`
    );
    root.style.setProperty(
      '--dominant-color-light',
      `rgba(${r}, ${g}, ${b}, 0.3)`
    );
    root.style.setProperty(
      '--dominant-color-dark',
      `rgba(${Math.max(0, r - 50)}, ${Math.max(0, g - 50)}, ${Math.max(
        0,
        b - 50
      )}, 0.9)`
    );

    // Create a complementary color for variety
    const complementary = this.getComplementaryColor([r, g, b]);
    root.style.setProperty(
      '--complementary-color',
      `rgba(${complementary[0]}, ${complementary[1]}, ${complementary[2]}, 0.8)`
    );
  }

  setFallbackColor(): void {
    const fallback = 'rgba(17, 19, 21, 0.8)';
    this.dominantColor.set(fallback);

    // Set fallback CSS variables
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
    // Simple complementary color calculation
    return [255 - r, 255 - g, 255 - b];
  }

  // Method to manually trigger color re-extraction (useful for image changes)
  refreshColors(): void {
    setTimeout(() => this.setupColorExtraction(), 100);
  }
}
