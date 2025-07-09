import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterPipe',
  standalone: false,
})
export class FilterByPipe implements PipeTransform {
  transform<T extends Record<string, any>>(
    items: T[],
    searchTerm: string,
    key: keyof T
  ): T[] {
    if (!searchTerm || !items || !key) return items;

    const lowerSearch = searchTerm.toLowerCase();

    return items.filter((item) =>
      String(item[key]).toLowerCase().includes(lowerSearch)
    );
  }
}
