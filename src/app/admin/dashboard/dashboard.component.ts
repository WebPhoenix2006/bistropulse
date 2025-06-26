import { Component } from '@angular/core';

import { curveBasis } from 'd3-shape';
import { Color, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  curve = curveBasis;
  currentTabIndex = 0;

  colorScheme: Color = {
    name: 'customScheme',
    selectable: true,
    group: ScaleType.Ordinal, // ✅ correct way
    domain: ['#3366FF', '#FF3B3B'],
  };

  xAxisTickFormatting = (val: string) => {
    return new Date(val).toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  lineChartData = [
    {
      name: 'This Month',
      series: [
        { name: '2025-06-24T10:00:00', value: 30 },
        { name: '2025-06-24T11:00:00', value: 35 },
        { name: '2025-06-24T12:00:00', value: 42 },
        { name: '2025-06-24T13:00:00', value: 50 },
        { name: '2025-06-24T14:00:00', value: 48 },
        { name: '2025-06-24T15:00:00', value: 52 },
        { name: '2025-06-24T16:00:00', value: 40 },
      ],
    },
    {
      name: 'Last Month',
      series: [
        { name: '2025-06-24T10:00:00', value: 28 },
        { name: '2025-06-24T11:00:00', value: 30 },
        { name: '2025-06-24T12:00:00', value: 39 },
        { name: '2025-06-24T13:00:00', value: 43 },
        { name: '2025-06-24T14:00:00', value: 39 },
        { name: '2025-06-24T15:00:00', value: 35 },
        { name: '2025-06-24T16:00:00', value: 37 },
      ],
    },
  ];
  onTabChange(index:number){
    this.currentTabIndex = index;
  }
}
