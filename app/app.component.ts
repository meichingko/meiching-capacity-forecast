import { Component } from '@angular/core';
import { Http } from '@angular/http';

import * as Highcharts from 'highcharts';

import * as _ from 'underscore';
import { DndDropEvent, DropEffect } from 'ngx-drag-drop';
// import { HttpClient } from '@angular/common/http';
declare var require: any;
let count = 1;

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options;
  selectedMonth: string = 'January';
  monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  // monthlyData: any;
  // // Mock data, replace with actual backend data.
  monthlyData = {
    January: [80, 85, 88, 78, 82, 83, 85, 87, 88, 89, 84, 81],
    February: [75, 79, 81, 83, 85, 88, 90, 85, 82, 80, 78, 79],
    March: [85, 88, 84, 82, 83, 86, 89, 80, 78, 76, 82, 88],
    April: [82, 86, 80, 85, 88, 90, 87, 83, 80, 75, 77, 81],
    May: [79, 83, 85, 87, 89, 88, 85, 82, 78, 81, 80, 82],
    June: [84, 88, 90, 85, 83, 87, 88, 80, 82, 84, 79, 81],
    July: [78, 82, 84, 87, 89, 88, 85, 83, 81, 80, 79, 78],
    August: [85, 88, 89, 87, 83, 81, 82, 80, 78, 85, 87, 88],
    September: [81, 83, 85, 87, 89, 85, 80, 82, 84, 86, 87, 88],
    October: [79, 81, 83, 85, 87, 88, 90, 89, 87, 85, 83, 82],
    November: [84, 86, 85, 83, 82, 81, 80, 85, 87, 88, 86, 84],
    December: [80, 82, 85, 88, 87, 83, 81, 78, 76, 82, 85, 88],
  };
  columnDefs = [
    { headerName: 'Month', field: 'month' },
    { headerName: 'Capacity (%)', field: 'capacity' },
    { headerName: 'Downtime (hrs)', field: 'downtime' },
    { headerName: 'Throughput (u)', field: 'throughput' },
  ];

  rowData: any = []; // This will hold the data for the grid
  constructor() {
    // this.loadMonthlyData();
    // this.updateChart();
  }
  ngOnInit() {
    this.loadMonthlyData();
  }
  loadMonthlyData(): void {
    // this.httpClient.get('assets/monthlyData.json').subscribe((data) => {
    //   console.log('data', data);
    //   this.monthlyData = data;
    this.rowData = this.processData(this.monthlyData);

    this.updateChart();
    // });
  }
  // // Update chart based on selected month
  updateChart(): void {
    const startIndex = this.monthNames.indexOf(this.selectedMonth);
    const forecastMonths = [
      ...this.monthNames.slice(startIndex),
      ...this.monthNames.slice(0, startIndex),
    ];
    const forecastData = this.monthlyData[this.selectedMonth] || [];
    this.chartOptions = {
      title: { text: '12-Month Equipment Capacity Forecast' },
      xAxis: { categories: forecastMonths },
      yAxis: { title: { text: 'Capacity Utilization (%)' } },
      tooltip: { valueSuffix: '%' },
      series: [
        {
          name: 'Predicted Capacity',
          type: 'line',
          data: forecastData,
          color: '#007bff',
        },
      ],
    };
  }
  processData(data: any): any[] {
    const result = [];
    for (const month in data) {
      if (data.hasOwnProperty(month)) {
        const capacityData = data[month];
        const capacity =
          capacityData.reduce((acc: number, val: number) => acc + val, 0) /
          capacityData.length;
        const downtime = Math.floor(Math.random() * 12); // Sample downtime, replace with your logic
        const throughput = Math.floor(Math.random() * 600); // Sample throughput, replace with your logic
        result.push({
          month: month,
          capacity: Math.round(capacity),
          downtime: downtime,
          throughput: throughput,
        });
      }
    }
    return result;
  }
  // months = [
  //   { value: 1, name: 'January' },
  //   { value: 2, name: 'February' },
  //   { value: 3, name: 'March' },
  //   { value: 4, name: 'April' },
  //   { value: 5, name: 'May' },
  //   { value: 6, name: 'June' },
  //   { value: 7, name: 'July' },
  //   { value: 8, name: 'August' },
  //   { value: 9, name: 'September' },
  //   { value: 10, name: 'October' },
  //   { value: 11, name: 'November' },
  //   { value: 12, name: 'December' },
  // ];
  // selectedMonth: number = 1;
  // onMonthChange(event: Event) {
  //   const target = event.target as HTMLSelectElement;
  //   console.log('Selected month:', target.value);
  // }
  // type = 'line';
  // zoomType = 'x';
  // data = [
  //   {
  //     name: 'OMAK-C',
  //     data: [
  //       { x: 1512691300000, y: 2.787037037037037, equipmentName: 'OMAK-C' },
  //       { x: 1512691400000, y: 61.638888888888886, equipmentName: 'OMAK-C' },
  //       { x: 1512691500000, y: 56.97222222222222, equipmentName: 'OMAK-C' },
  //       { x: 1512692200000, y: 67.7962962962963, equipmentName: 'OMAK-C' },
  //       { x: 1512693200000, y: 58.2037037037037, equipmentName: 'OMAK-C' },
  //     ],
  //   },
  //   {
  //     name: 'OMAK-B',
  //     data: [
  //       { x: 1512691300000, y: 3.5, equipmentName: 'OMAK-B' },
  //       { x: 1512691400000, y: 50.0, equipmentName: 'OMAK-B' },
  //       { x: 1512691500000, y: 60.0, equipmentName: 'OMAK-B' },
  //       { x: 1512692200000, y: 70.5, equipmentName: 'OMAK-B' },
  //       { x: 1512693200000, y: 45.2, equipmentName: 'OMAK-B' },
  //       { x: 1512694200000, y: 65.7, equipmentName: 'OMAK-B' },
  //     ],
  //   },
  // ];
  // xAxis = { title: { text: 'Sample X-Axis' }, type: 'datetime' };
  // yAxis = { title: { text: 'Sample Y-Axis' } };
  // footer = 'Sample Footer';
  // color = ['rgb(23,119,25)', 'rgb(255,0,0)'];
  // tooltip = {
  //   formatter: function () {
  //     return `<span style="font-size:10px">${this.series.chart.time.dateFormat(
  //       '%A, %b %d, %Y %H:%M:%S',
  //       this.key
  //     )}
  //     </span><table style="margin-bottom:unset"><tr>
  //     <td style="color:${this.color};padding:0">
  //       ${this.point.equipmentName}</td><td style="padding:0"> : </td>
  //       <td style="padding:0"><b>${this.y.toFixed(2)}</b></td></tr></table>`;
  //   },
  //   useHTML: true,
  // };
  // exporting = { title: 'Testing', filename: 'Test', scale: 3 };
  // config = {
  //   legend: {
  //     align: 'center',
  //     verticalAlign: 'top',
  //     maxHeight: 40,
  //     x: 0,
  //     y: 3,
  //     borderWidth: 1,
  //     borderRadius: 3,
  //     itemMarginTop: 2,
  //     padding: 5,
  //     navigation: { style: { color: '#FFFFFF' }, activeColor: '#039BD5' },
  //     // itemStyle: { color: "#E0E0E3", fontWeight: "normal" },
  //     itemHoverStyle: { color: '#FFF' },
  //     itemHiddenStyle: { color: '#606063' },
  //   },
  // };
  // load = '(Nothing)';
  // chartInstance;
  // loaded = false;
  // constructor() {}
  // ngOnInit() {}
  // onLoad(e) {
  //   this.loaded = true;
  //   this.chartInstance = e;
  //   console.log(this.chartInstance);
  //   this.load = JSON.stringify(e.options);
  // }
}
