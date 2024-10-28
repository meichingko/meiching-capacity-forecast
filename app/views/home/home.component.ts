import { Component } from '@angular/core';
import { Http } from '@angular/http';

import highcharts from 'highcharts';
@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeViewComponent {
  users;



  options: Object = {
    chart: {
      type: 'scatter',
    },
    title: {
      text: 'Demo of predefined, image and custom marker symbols'
    },
    subtitle: {
      text: '*) Base64 not supported in IE6 and IE7',
      verticalAlign: 'bottom',
      align: 'right',
      y: null,
      style: {
        fontSize: '10px'
      }
    },
    credits: {
      enabled: false
    },
    legend: {
      y: -40 // make room for subtitle
    },
    xAxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    series: [{
      name: 'Predefined symbol',
      data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 316.4, 294.1, 195.6, 154.4]
    }, {
      name: 'symbol',
      data: [216.4, 194.1, 95.6, 54.4, 29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5]
    }, {
      linkedTo: 'cross-series',
      name: 'Custom symbol',
      data: [54.4, 29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6],
      color: 'red',
      marker: {
        symbol: 'cross',
        lineColor: null,
        lineWidth: 2
      }
    }, {
      id: 'cross-series',
      name: 'Custom symbol',
      type: 'line',
      color: 'red',
      marker: {
        symbol: 'cross',
        lineColor: null,
        lineWidth: 2
      }
    }]
  }
    ;
  constructor(private http: Http) {
    this.http.get('https://jsonplaceholder.typicode.com/users')
      .map(res => res.json())
      .subscribe(res => this.users = res)

    highcharts.SVGRenderer.prototype.symbols.cross = function (x, y, w, h) {
      return ['M', x, y, 'L', x + w, y + h, 'M', x + w, y, 'L', x, y + h, 'z'];
    };

    // Dont Remove This
    highcharts['seriesTypes']['scatter'].prototype.drawLegendSymbol = highcharts['seriesTypes']['column'].prototype.drawLegendSymbol;
   // Dont Remove This. I found out if other chart is using this, it wont reset to original line. You can command the code and go to Login and go back Home, its will remain same legend symbol
  highcharts['seriesTypes']['line'].prototype.drawLegendSymbol = highcharts['seriesTypes']['column'].prototype.drawLegendSymbol


  }

}
