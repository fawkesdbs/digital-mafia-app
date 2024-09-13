import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { TimeEntryService } from '../../services/time-entry.service';
import { ChartData, ChartOptions } from 'chart.js';
import { CustomJwtPayload } from '../../interfaces/jwt.interfaces';
import * as jwt_decode from 'jwt-decode';
import { InputComponent } from '../input/input.component';

@Component({
  selector: 'app-time-entry-graph',
  standalone: true,
  imports: [CommonModule, BaseChartDirective, InputComponent],
  templateUrl: './time-entry-graph.component.html',
  styleUrl: './time-entry-graph.component.css',
})
export class TimeEntryGraphComponent implements OnInit {
  token = localStorage.getItem('authToken') || '';
  decodedToken: CustomJwtPayload = jwt_decode.jwtDecode(this.token);
  userId = this.decodedToken.id;

  now = new Date();
  startDate = `${this.now.getFullYear()}-${this.now.getMonth() + 1}-01`;
  endDate = this.formatDate(this.now);
  showCustomRange = false;

  // Define the labels (x-axis labels for both charts)
  chartLabels: string[] = [];

  // Define the bar chart data (Hours Worked)
  barChartData: ChartData<'bar'> = {
    labels: this.chartLabels,
    datasets: [
      {
        label: 'Hours Worked',
        data: [], // Example data for hours worked
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Define the line chart data (Entries per Day)
  lineChartData: ChartData<'line'> = {
    labels: this.chartLabels,
    datasets: [
      {
        label: 'Entries',
        data: [], // Example data for number of entries
        fill: false,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        tension: 0,
      },
    ],
  };

  // Define the chart options (common options for both charts)
  chartOptionsBar: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Hours Worked Per Day', // Title for the bar chart
        font: {
          size: 16,
        },
        padding: {
          bottom: 10,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  chartOptionsLine: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Jobs Started Per Day', // Title for the line chart
        font: {
          size: 16,
        },
        padding: {
          bottom: 10,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  constructor(private timeEntryService: TimeEntryService) {}

  ngOnInit(): void {
    this.updateCharts();
  }

  setTimePeriod(period: string): void {
    const today = new Date();
    switch (period) {
      case 'today':
        this.showCustomRange = false;
        this.startDate = this.endDate = this.formatDate(today);
        break;
      case 'thisWeek':
        this.showCustomRange = false;
        this.startDate = this.formatDate(this.getStartOfWeek(today));
        this.endDate = this.formatDate(this.getEndOfWeek(today));
        break;
      case 'thisMonth':
        this.showCustomRange = false;
        this.startDate = this.formatDate(
          new Date(today.getFullYear(), today.getMonth(), 1)
        );
        this.endDate = this.formatDate(
          new Date(today.getFullYear(), today.getMonth() + 1, 0)
        );
        break;
      case 'lastMonth':
        this.showCustomRange = false;
        const lastMonth = new Date(
          today.getFullYear(),
          today.getMonth() - 1,
          1
        );
        this.startDate = this.formatDate(lastMonth);
        this.endDate = this.formatDate(
          new Date(today.getFullYear(), today.getMonth(), 0)
        );
        break;
      case 'custom':
        this.showCustomRange = !this.showCustomRange;
        break;
      default:
        this.showCustomRange = false;
        break;
    }
    this.updateCharts();
  }

  applyCustomRange() {
    this.updateCharts();
  }

  private updateCharts(): void {
    this.chartLabels = this.generateDateRange(this.startDate);

    this.timeEntryService
      .getTimeEntries(this.userId, this.startDate, this.endDate)
      .subscribe((entries) => {
        const groupedByDate = this.groupEntriesByDate(entries);

        this.barChartData = {
          labels: this.chartLabels,
          datasets: [
            {
              label: 'Hours Worked',
              data: this.chartLabels.map(
                (date) => groupedByDate[date]?.totalHours || 0
              ),
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        };

        this.lineChartData = {
          labels: this.chartLabels,
          datasets: [
            {
              label: 'Entries',
              data: this.chartLabels.map(
                (date) => groupedByDate[date]?.entryCount || 0
              ),
              fill: false,
              borderColor: 'rgba(255, 99, 132, 1)',
              backgroundColor: 'rgba(255, 99, 132, 0.6)',
              tension: 0,
            },
          ],
        };
      });
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Add leading zero
    const day = date.getDate().toString().padStart(2, '0'); // Add leading zero
    return `${year}-${month}-${day}`;
  }

  private getStartOfWeek(date: Date): Date {
    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay());
    return start;
  }

  private getEndOfWeek(date: Date): Date {
    const end = new Date(date);
    end.setDate(end.getDate() + (6 - end.getDay()));
    return end;
  }

  private generateDateRange(startDate: string): string[] {
    const dateArray: string[] = [];
    let currentDate = new Date(startDate);
    const lastDate = new Date();

    while (currentDate <= lastDate) {
      dateArray.push(this.formatDate(currentDate)); // Push formatted date
      currentDate.setDate(currentDate.getDate() + 1); // Move to next day
    }

    return dateArray;
  }

  // Helper function to group entries by date
  groupEntriesByDate(entries: any[]): any {
    const grouped: any = {};
    entries.forEach((entry) => {
      const date = entry.date.split('T')[0]; // Format the date (YYYY-MM-DD)
      if (!grouped[date]) {
        grouped[date] = { totalHours: 0, entryCount: 0 };
      }
      grouped[date].totalHours += entry.hours;
      grouped[date].entryCount += 1;
    });
    return grouped;
  }
}
