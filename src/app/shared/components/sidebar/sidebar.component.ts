import { Component, ElementRef, ViewChild, viewChild } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  @ViewChild('sidebar') sidebar: ElementRef;
  closeSidebar() {
    this.sidebar.nativeElement.classList.toggle('hide-sidebar');
    console.log(this.sidebar)
  }
}
