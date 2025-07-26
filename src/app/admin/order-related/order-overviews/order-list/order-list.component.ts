import { Component } from '@angular/core';
import { BootstrapToastService } from '../../../../shared/services/bootstrap-toast.service';

@Component({
  selector: 'app-order-list',
  standalone: false,
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.scss',
})
export class OrderListComponent {
  constructor(private toastB: BootstrapToastService) {}

  showToast(): void {
    this.toastB.showSuccess('working successfully');
  }
  longerToast(): void {
    this.toastB.showWarning('This will stay longer', 5000);
  }

  clearToasts(): void {
    this.toastB.clearAll();
  }
}
