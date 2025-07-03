import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CustomerStateService {
  constructor() {}

  private selectedCustomer = new BehaviorSubject<any>(null);
  selectedCustomer$ = this.selectedCustomer.asObservable();

  setCustomer(customer: any) {
    this.selectedCustomer.next(customer);
  }
  getSelectedCustomerValue() {
    return this.selectedCustomer.getValue();
  }
}
