import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class OfflineService {
  private readonly _isOffline = signal(
    typeof navigator !== 'undefined' ? !navigator.onLine : false
  );
  readonly isOffline = this._isOffline.asReadonly();

  constructor() {
    typeof window !== 'undefined'
      ? window.addEventListener('online', () => this._isOffline.set(false))
      : null;
    typeof window !== 'undefined'
      ? window.addEventListener('offline', () => this._isOffline.set(true))
      : null;
  }
}
