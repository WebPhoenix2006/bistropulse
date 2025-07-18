import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root',
})
export class RiderStateService {
  constructor() {}

  private selectedRider = new BehaviorSubject<any>(null);
  selectedRider$ = this.selectedRider.asObservable();

  setCustomer(customer: any) {
    this.selectedRider.next(customer);
  }
  getSelectedCustomerValue() {
    return this.selectedRider.getValue();
  }
}
