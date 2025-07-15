import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ListItemService {
  filterAndPaginate<T>(
    list: T[],
    searchTerm: string,
    keys: Array<keyof T>,
    filters: Partial<Record<string, string | number>>,
    currentPage: number,
    itemsPerPage: number
  ): { results: T[]; totalCount: number } {
    let filtered = [...list];

    // Keyword search
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      filtered = filtered.filter((item) =>
        keys.some((key) => String(item[key]).toLowerCase().includes(lowerTerm))
      );
    }

    // Extra filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter(
          (item) =>
            String((item as any)[key]).toLowerCase() ===
            String(value).toLowerCase()
        );
      }
    });

    // Pagination
    const totalCount = filtered.length;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginated = filtered.slice(startIndex, startIndex + itemsPerPage);

    return { results: paginated, totalCount };
  }
}
