import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartDataset } from 'chart.js';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
})
export class DashboardComponent implements OnInit {
  public lineChartData: ChartDataset<'line'>[] = [
    { data: [], label: 'Hours Logged' },
  ];
  public lineChartLabels: string[] = [];
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
  };
  public lineChartType: 'line' = 'line';

  // New bar chart properties
  public barChartData: ChartDataset<'bar'>[] = [
    { data: [], label: 'Daily Logins' },
  ];
  public barChartLabels: string[] = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];
  public barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
  };
  public barChartType: 'bar' = 'bar';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.updateCharts();
  }

  // Update charts with the latest data
  private updateCharts() {
    const data = this.authService.getSessionDurations(); // Directly get the data without subscribe
    this.lineChartLabels = data.map((entry) => entry.date);
    this.lineChartData[0].data = data.map((entry) => entry.hours);

    const dailyData = this.calculateDailyLogins(data);
    this.barChartData[0].data = dailyData;
  }

  // Helper function to calculate daily logins
  private calculateDailyLogins(
    data: { date: string; hours: number }[]
  ): number[] {
    const dailyTotals = Array(7).fill(0);

    data.forEach((entry) => {
      const date = new Date(entry.date);
      const dayOfWeek = date.getDay();
      dailyTotals[dayOfWeek] += entry.hours;
    });

    return dailyTotals;
  }
}
