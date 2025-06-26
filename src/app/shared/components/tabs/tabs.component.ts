import { Component, ContentChildren, EventEmitter, Input, Output, QueryList } from '@angular/core';
import { TabComponent } from '../tab/tab.component';

@Component({
  selector: 'cus-tabs',
  standalone: false,
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss'
})
export class TabsComponent {
 @ContentChildren(TabComponent) tabs!: QueryList<TabComponent>;
  @Input() customClass = '';
  @Output() tabChanged = new EventEmitter<number>();

  ngAfterContentInit() {
    const activeTabs = this.tabs.filter(tab => tab.active);
    if (activeTabs.length === 0 && this.tabs.length > 0) {
      this.selectTab(0);
    }
  }

  selectTab(index: number) {
    this.tabs.forEach((tab, i) => (tab.active = i === index));
    this.tabChanged.emit(index);
  }
}
