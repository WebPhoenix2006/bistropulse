// rider-shifts.component.ts
import { Component, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { RiderService } from '../../../shared/services/rider.service';
import { FilterByPipe } from '../../../shared/pipes/filter.pipe';
import { SlowNetworkService } from '../../../shared/services/slow-nerwork.service';

@Component({
  selector: 'app-rider-shifts',
  templateUrl: './rider-shifts.component.html',
  styleUrls: ['./rider-shifts.component.scss'],
  providers: [FilterByPipe],
  standalone: false,
})
export class RiderShiftsComponent {
  riderservice = inject(RiderService);
  searchTerm = '';
  riders: any[] = [];
  filteredList: any[] = [];
  shiftStarted: boolean;

  isLoading = false;
  currentPage = 1;
  itemsPerPage = 10;
  totalCount = 0;

  openDropdownIndex: number | null = null;

  // Unified modal control
  activeModalId: string | null = null;

  constructor(
    private toastr: ToastrService,
    public slowNetwork: SlowNetworkService,
    private filterPipe: FilterByPipe
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('auth_token');
    if (token) {
      this.loadRiders();
    }
  }

  loadRiders(): void {
    this.isLoading = true;
    this.slowNetwork.start(() => {
      if (this.isLoading) {
        this.toastr.warning('Hmm... slow network');
      }
    });

    this.riderservice.getRiders().subscribe({
      next: (res: any) => {
        this.riders = res.results.map((c: any) => ({ ...c, checked: false })) || [];
        this.applyFilters();
        this.isLoading = false;
        this.slowNetwork.clear();
      },
      error: () => {
        this.toastr.error('❌ Failed to fetch riders');
        this.riders = [];
        this.filteredList = [];
        this.totalCount = 0;
        this.isLoading = false;
        this.slowNetwork.clear();
      },
    });
  }

  applyFilters(): void {
    const filtered = this.filterPipe.transform(this.riders, this.searchTerm, 'name');
    this.totalCount = filtered.length;

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.filteredList = filtered.slice(startIndex, endIndex);
  }

  get filteredriders(): any[] {
    return this.filteredList;
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.applyFilters();
  }

  toggleDropdown(index: number): void {
    this.openDropdownIndex = this.openDropdownIndex === index ? null : index;
  }

  isToolbarOpen(index: number): boolean {
    return this.openDropdownIndex === index;
  }

  toggleSelection(index: number): void {
    this.filteredList[index].checked = !this.filteredList[index].checked;
  }

  allSelected(): boolean {
    return this.filteredList.every((c) => c.checked);
  }

  toggleSelectAll(): void {
    const newState = !this.allSelected();
    this.filteredList.forEach((c) => (c.checked = newState));
  }

  get totalPages(): number {
    return Math.ceil(this.totalCount / this.itemsPerPage);
  }

  // Modal control
  openModal(id: string) {
    this.activeModalId = id;
  }

  closeModal() {
    this.activeModalId = null;
  }

  // Shortcuts for closing
  close() {
    this.closeModal();
  }

  close2() {
    this.closeModal();
  }

  close3() {
    this.closeModal();
  }

  // Variable to hold the counter as a string (HH:MM:SS)
counter: string = '00:00:00';

// To store the interval reference so we can stop it later
private intervalId: any;

// Starts the live hour:minute:second counter
startCount() {
  // Initialize hours, minutes, and seconds
  let hours = 0;
  let minutes = 0;
  let seconds = 0;

  // Use setInterval to update the counter every second (1000 ms)
  this.intervalId = setInterval(() => {
    seconds++; // Increment seconds

    // When seconds reach 60, reset to 0 and increment minutes
    if (seconds === 60) {
      seconds = 0;
      minutes++;
    }

    // When minutes reach 60, reset to 0 and increment hours
    if (minutes === 60) {
      minutes = 0;
      hours++;
    }

    // Format the counter as HH:MM:SS using pad() helper
    this.counter = 
      this.pad(hours) + ':' + 
      this.pad(minutes) + ':' + 
      this.pad(seconds);
  }, 1000); // repeat every 1 second
}

// Helper method to add leading zero for single-digit numbers
pad(num: number): string {
  return num < 10 ? '0' + num : '' + num;
}

// Stops the timer and clears the interval
stopCount() {
  clearInterval(this.intervalId);
}

}
