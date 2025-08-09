import { Component, inject, OnInit, signal } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FilterByPipe } from '../../../shared/pipes/filter.pipe';
import { SlowNetworkService } from '../../../shared/services/slow-nerwork.service';
import { RiderService } from '../../../shared/services/rider.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-riders',
  standalone: false,
  providers: [FilterByPipe],
  templateUrl: './riders.component.html',
  styleUrl: './riders.component.scss',
})
export class RidersComponent implements OnInit {
  riderservice = inject(RiderService);
  searchTerm = '';
  riders: any[] = [];
  filteredList: any[] = [];

  isLoading = false;
  currentPage = 1;
  itemsPerPage = 10;
  totalCount = 0;
  restaurantId = signal<string | null>(null); // starts as null

  openDropdownIndex: number | null = null;
  constructor(
    private toastr: ToastrService,
    public slowNetwork: SlowNetworkService,
    private filterPipe: FilterByPipe,
    private activeRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('auth_token');
    if (token) {
      this.loadRiders();
    }

    const id = this.activeRoute.snapshot.paramMap.get('id');
    this.restaurantId.set(id);
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
        this.riders =
          res.results.map((c: any) => ({ ...c, checked: false })) || [];
        this.applyFilters();
        this.totalCount = this.filteredList.length;
        this.isLoading = false;
        this.slowNetwork.clear();
      },
      error: (err) => {
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
    const filtered = this.filterPipe.transform(
      this.riders,
      this.searchTerm,
      'name'
    );
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
}
