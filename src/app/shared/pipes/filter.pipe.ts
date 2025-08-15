import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterPipe',
  standalone: false,
})
export class FilterByPipe implements PipeTransform {
  transform<T extends Record<string, any>>(
    items: T[],
    searchTerm: string,
    key: keyof T,
    highlightAll: boolean = true // <-- new flag
  ): T[] {
    if (!searchTerm || !items || !key) return items;

    // Decide regex flags based on highlightAll
    const flags = highlightAll ? 'gi' : 'i';
    const searchRegex = new RegExp(`(${searchTerm})`, flags);

    return items
      .filter((item) =>
        String(item[key]).toLowerCase().includes(searchTerm.toLowerCase())
      )
      .map((item) => {
        const value = String(item[key]);
        return {
          ...item,
          [key]: value.replace(
            searchRegex,
            '<span class="highlight">$1</span>'
          ),
        };
      });
  }
}
