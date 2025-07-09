import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class OfflineService {
  private readonly _isOffline = signal(!navigator.onLine);
  readonly isOffline = this._isOffline.asReadonly();

  constructor() {
    window.addEventListener('online', () => this._isOffline.set(false));
    window.addEventListener('offline', () => this._isOffline.set(true));
  }
}
