import { inject } from "@angular/core";
import { BootstrapToastService } from "../services/bootstrap-toast.service";

export class ExportService {
  constructor(
      private toastr = inject(BootstrapToastService)

  ) {
   
  }

  exportToCsv(tableId: string, filename: string = 'export.csv'): void {
    const table: HTMLTableElement | null = document.querySelector(`#${tableId}`);
    if (!table) {
      console.error(`Table with id ${tableId} not found`);
      this.toastr.showError('Oops! Failed to export...')
      return;
    }

    let csv: string[] = [];

    // Headers
    const headers = Array.from(table.querySelectorAll('thead tr td, thead tr th'))
      .map(header => `"${(header.textContent || '').trim()}"`);
    csv.push(headers.join(','));

    // Rows
    const rows = table.querySelectorAll('tbody tr');
    rows.forEach(row => {
      const cols = Array.from(row.querySelectorAll('td'))
        .map(col => `"${(col.textContent || '').trim()}"`);
      csv.push(cols.join(','));
    });

    // Download
    const blob = new Blob([csv.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
