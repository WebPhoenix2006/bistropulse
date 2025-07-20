import {
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  Output,
  QueryList,
  AfterContentInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { TabComponent } from '../tab/tab.component';

@Component({
  selector: 'cus-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  standalone: false,
})
export class TabsComponent implements AfterContentInit, OnChanges {
  @ContentChildren(TabComponent) tabs!: QueryList<TabComponent>;

  @Input() customClass: string = '';
  @Input() selectedIndex: number = 0;
  @Output() tabChanged = new EventEmitter<number>();

  private hasInitialized = false;

  ngAfterContentInit() {
    this.hasInitialized = true;
    this.selectTab(this.selectedIndex, false); // avoid emitting on init
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      this.hasInitialized &&
      changes['selectedIndex'] &&
      !changes['selectedIndex'].firstChange
    ) {
      this.selectTab(this.selectedIndex, false); // avoid emitting on route changes
    }
  }

  selectTab(index: number, emit: boolean = true) {
    if (!this.tabs || index < 0 || index >= this.tabs.length) return;

    this.tabs.forEach((tab, i) => (tab.active = i === index));

    if (emit) {
      this.tabChanged.emit(index);
    }
  }
}
