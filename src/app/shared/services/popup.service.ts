import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PopupService {
  private _message = signal<string>('');
  private _isVisible = signal(false);

  get message() {
    return this._message();
  }

  get isVisible() {
    return this._isVisible();
  }

  show(msg: string) {
    this._message.set(msg);
    this._isVisible.set(true);
    setTimeout(() => this._isVisible.set(false), 3000);
  }
}
