import {
  Component,
  HostListener,
  inject,
  OnInit,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { Extra } from '../../../interfaces/extra.interface';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SlowNetworkService } from '../../../shared/services/slow-nerwork.service';
import { FilterByPipe } from '../../../shared/pipes/filter.pipe';
import { ListItemService } from '../../../shared/services/list-item.service';

@Component({
  selector: 'app-extra',
  standalone: false,
  templateUrl: './extra.component.html',
  styleUrl: './extra.component.scss',
  providers: [FilterByPipe],
})
export class ExtraComponent implements OnInit {
  isFilterModalOpen = signal<boolean>(false);
  buttonText = signal<string>('Filter');
  searchTerm = signal<string>('');
  isLoading = signal<boolean>(false);
  locationFilter = signal<string>('');
  ratingFilter = signal<string>('');
  statusFilter = signal<string>('');

  filteredList: Array<Extra> = [];

  currentPage = 1;
  itemsPerPage = 10;
  totalCount = 0;

  private listUtils = inject(ListItemService);

  applyFilters(): void {
    const { results, totalCount } = this.listUtils.filterAndPaginate(
      this.EXTRAS_LIST,
      this.searchTerm(),
      ['name'], // searchable keys
      {
        location: this.locationFilter(),
        rating: this.ratingFilter(),
        status: this.statusFilter(),
      },
      this.currentPage,
      this.itemsPerPage
    );

    this.filteredList = results;
    this.totalCount = totalCount;
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.applyFilters();
  }

  get filterList(): Extra[] {
    return this.filteredList;
  }

  toggleFilterModal(): void {
    this.isFilterModalOpen.set(!this.isFilterModalOpen());
    this.closeAll();
  }

  EXTRAS_LIST: Extra[] = [
    {
      id: 'E001',
      name: 'Pepsi, 0.5 L',
      image: 'assets/food-images/pepsi.png',
      price: 24.0,
      checked: false,
      isToolbarOpen: false,
    },
    {
      id: 'E002',
      name: 'Bottle water',
      image: 'assets/food-images/bottle-water.png',
      price: 24.0,
      checked: false,
      isToolbarOpen: false,
    },
    {
      id: 'E003',
      name: 'Fries',
      image: 'assets/food-images/fries.png',
      price: 24.0,
      checked: false,
      isToolbarOpen: false,
    },
    {
      id: 'E004',
      name: 'Pepsi, 0.5 L',
      image: 'assets/food-images/pepsi.png',
      price: 24.0,
      checked: false,
      isToolbarOpen: false,
    },
    {
      id: 'E005',
      name: 'Bottle water',
      image: 'assets/food-images/bottle-water.png',
      price: 24.0,
      checked: false,
      isToolbarOpen: false,
    },
    {
      id: 'E006',
      name: 'Fries',
      image: 'assets/food-images/fries.png',
      price: 24.0,
      checked: false,
      isToolbarOpen: false,
    },
  ];

  @HostListener('document:click', ['$event'])
  handleDocumentClick(event: MouseEvent) {
    const clickedElement = event.target as HTMLElement;
    const isInsideToolbar = clickedElement.closest('.toolbar') !== null;
    const isToolbarToggle = clickedElement.closest('.toolbar-toggle') !== null;
    const isInsideFilter = clickedElement.closest('#filter-modal') !== null;
    const isFilterButton =
      clickedElement.closest('#filter-modal-button') !== null;

    if (!isInsideToolbar && !isToolbarToggle) {
      this.closeAll();
    }
    if (!isInsideFilter && !isFilterButton) {
      this.isFilterModalOpen.set(false);
    }
  }

  toggleSelection(index: number): void {
    this.filteredList[index].checked = !this.filteredList[index].checked;
  }

  toggleSelectAll(): void {
    const newState = !this.allChecked();
    this.filteredList.forEach((r) => (r.checked = newState));
  }

  allChecked(): boolean {
    return this.filteredList.every((r) => r.checked);
  }

  toggleVisibility(id: string): void {
    const currentOpenState = this.filterList.find(
      (r) => r.id === id
    )?.isToolbarOpen;

    this.filterList.forEach((r) => (r.isToolbarOpen = false));
    if (!currentOpenState) {
      const match = this.filterList.find((r) => r.id === id);
      if (match) match.isToolbarOpen = true;
    }
  }

  closeAll(): void {
    this.filterList.forEach((r) => (r.isToolbarOpen = false));
  }

  get totalPages(): number {
    return Math.ceil(this.totalCount / this.itemsPerPage);
  }

  ngOnInit(): void {
    this.applyFilters();
  }
}
