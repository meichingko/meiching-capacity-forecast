import { Component } from '@angular/core';
import { Http } from '@angular/http';

import * as Highcharts from 'highcharts';

import * as _ from 'underscore';
import { DndDropEvent, DropEffect } from 'ngx-drag-drop';
declare var require: any;
let count = 1;
@Component({
  selector: 'home',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogViewComponent {
  name = 'Angular';
  chart;
  updateFlag: boolean = false;
  Highcharts = this.highchartsFactory();
  waveFormListData = [];
  theme = {
    chart: {
      backgroundColor: {
        linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
        stops: [
          [0, '#2a2a2b'],
          [1, '#3e3e40']
        ]
      },
      style: {
        fontFamily: '\'Unica One\', sans-serif'
      },
      plotBorderColor: '#606063'
    }
  }
  options: any;

  ngOnInit() {
    const options = {
      "plotOptions": {
        "series": {},
        "bar": {
          "grouping": false,
          "groupPadding": 0,
          "pointPadding": 0.2,
          "borderWidth": 0,
          "turboThreshold": 0
        },
        "column": {
          "grouping": false,
          "groupPadding": 0,
          "pointPadding": 0.2,
          "borderWidth": 0,
          "turboThreshold": 0
        },
        "line": {
          "marker": {
            "symbol": "circle",
            "enabled": true
          },
          "turboThreshold": 0,
          "gapSize": 86400000,
          "gapUnit": "value"
        },
        "spline": {
          "marker": {
            "symbol": "circle"
          },
          "turboThreshold": 0
        },
        "boxplot": {
          "fillColor": "rgb(100,100,100)",
          "turboThreshold": 0
        },
        "pie": {
          "allowPointSelect": true,
          "cursor": "pointer",
          "dataLabels": {
            "enabled": false
          },
          "showInLegend": true
        },
        "scatter": {
          "marker": {
            "symbol": "circle",
            "radius": 2,
            "states": {
              "hover": {
                "enabled": true,
                "lineColor": "rgb(100,100,100)"
              }
            }
          },
          "states": {
            "hover": {
              "marker": {
                "enabled": false
              }
            }
          },
          "turboThreshold": 0,
          "stickyTracking": false
        }
      },
      "chart": {
        "type": "line",
        "selectionMarkerFill": "rgba(255, 255, 255, 0.3)",
        "spacingTop": 5,
        "panning": true,
        "panKey": "ctrl",
        "marginBottom": 20,
        "zoomType": "x"
      },
      "rangeSelector": {
        "inputEnabled": false,
        "enabled": true
      },
      "navigator": {
        adaptToUpdatedData: false,
        "height": 20,
        "series": {}
      },
      "boost": {
        "enabled": false
      },
      "title": {
        "text": null
      },
      "subtitle": {
        "text": "No Data Available"
      },
      "xAxis": {
        "title": {
          "text": null
        },
        events: {
          afterSetExtremes: function (event) {
            console.log('after!');
            console.log(count)
            count++;
            // console.log(event, this)

            this.chart.showLoading('Loading data from server...');

            // Call API
            setTimeout(() => {
              var data = generateData(1000, event.min, event.max)

              // Clear all the series and readd again.
              while (this.chart.series[0]) {
                this.chart.series[0].remove(false);
              }

              data.forEach(d => {
                this.chart.addSeries(d, false);
              })
              this.chart.redraw(false);
              this.chart.hideLoading('Loading data from server...');
              // This method will let the data duplicate in the series if user rezoom the same place
              // this.chart.series[0].setData(data.mean);
              // this.chart.series[1].setData(data.range);
            }, 20);

            function generateData(point, start, end) {
              var interval = (end - start) / point;
              var mean = [], range = [];
              for (var i = 0; i < point; i++) {
                mean.push([i + interval, getRandomInt(3, 5)])
                range.push([i + interval, getRandomInt(0, 3), getRandomInt(5.1, 9.5)])
              }

              return [{ "name": "mean", "data": mean, zIndex: 1 }, {
                "name": "range",
                data: range,
                zIndex: 0,
                type: 'arearange',
                lineWidth: 0,
                fillOpacity: 0.3,
                marker: {
                  enabled: false
                }
              }]
            }

            function getRandomInt(min, max) {
              min = Math.ceil(min);
              max = Math.floor(max);
              return Math.floor(Math.random() * (max - min + 1)) + min;
            }

          }
          // afterSetExtremes: this.extreme
        }
      },
      "colors": ["rgb(5,160,167)", "rgb(5,160,167)"],
      "tooltip": {
        "headerFormat": "<span style=\"font-size:10px\">{point.key}</span><table style=\"margin-bottom:unset\">",
        "pointFormat": "<tr><td style=\"color:{series.color};padding:0\">{series.name}</td><td style=\"padding:0\"> : </td><td style=\"padding:0\"><b>{point.y}</b></td></tr>",
        "footerFormat": "</table>",
        "xDateFormat": "%A, %b %d, %Y",
        "shared": true,
        "useHTML": true,
        "followPointer": true,
        "split": false
      },
      "credits": {
        "enabled": false
      },
      "drilldown": {
        "animation": false,
        "series": [],
        "drillUpButton": {
          "relativeTo": "chart"
        }
      },
      scrollbar: {
        liveRedraw: false
      }
    }

    for (var i = 0; i < 3; i++) {
      const obj: any = {};
      obj.chart = {};
      obj.options = { ...options }


      var data = this.generateData(1000, 0, 5000000)

      obj.options.series = []

      obj.options.series.push({ "name": "mean", "data": data.mean, zIndex: 1 });

      obj.options.series.push({
        "name": "range",
        data: data.range,
        zIndex: 0,
        type: 'arearange',
        lineWidth: 0,
        fillOpacity: 0.3,
        marker: {
          enabled: false
        }
      });

      obj.channelName = "channel " + i;
      obj.id = this.GenerateID()

      this.waveFormListData.push(obj);
      console.log(obj)
    }

  }
  onChartsClick(e) {
    console.log(e);

    var chart = this.chart,
      xPos = chart.xAxis[0].toValue(e.chartY);

    chart.series[0].points.forEach(function (point) {
      if (xPos >= (point.x - 0.5) && xPos <= (point.x + 0.5)) {

        point.update({
          color: 'red'
        })
      }
    });
  }

  extreme(event) {
    console.log(count)
    count++;
    // console.log(event, this)

    this.chart.showLoading('Loading data from server...');

    setTimeout(() => {
      var data = generateData(1000, event.min, event.max)


      // while (this.chart.series[0]) {
      //   this.chart.series[0].remove(false);
      // }

      // data.forEach(d => {
      //   this.chart.addSeries(d, false);
      // })
      // this.chart.redraw(false);
      // this.chart.hideLoading('Loading data from server...');
      this.chart.series[0].setData(data[0]);
      this.chart.series[1].setData(data[1]);
    }, 20);

    function generateData(point, start, end) {
      var interval = (end - start) / point;
      var mean = [], range = [];
      for (var i = 0; i < point; i++) {
        mean.push([i + interval, getRandomInt(3, 5)])
        range.push([i + interval, getRandomInt(0, 3), getRandomInt(5.1, 9.5)])
      }
      // console.log(range)
      return [{ "name": "mean", "data": mean, zIndex: 1 }, {
        "name": "range",
        data: range,
        zIndex: 0,
        type: 'arearange',
        lineWidth: 0,
        fillOpacity: 0.3,
        marker: {
          enabled: false
        }
      }]
    }

    function getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

  }



  update() {

    var xAxis = { "currentValue": { "type": "datetime", "ordinal": false, "min": 1554163200000, "max": 1554768000000 } }

    var data = this.generateData(1000, 0, 5000000)

    var series = [{ "name": "mean", "data": data.mean, zIndex: 1 }]
    series.push({
      "name": "range",
      data: data.range,
      zIndex: 0,
      type: 'arearange',
      lineWidth: 0,
      fillOpacity: 0.3,
      marker: {
        enabled: false
      }
    });

    var nav = {
      "data": data.mean
    }

    // console.log(data)
    // this.options = {}
    this.options.navigator = {}
    this.options.navigator.series = data.mean

    this.options.series = series
    // console.log(this.options)
    this.updateFlag = true;
    // chart.downloadCSV()
  }



  generateData(point, start, end) {
    var interval = (end - start) / point;
    var mean = [], range = [];
    for (var i = 0; i < point; i++) {
      mean.push([i + interval, this.getRandomInt(3, 5)])
      range.push([i + interval, this.getRandomInt(0, 2.9), this.getRandomInt(6, 10)])
    }
    // console.log(range)
    return { range: range, mean: mean }
  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  onDrop(event: DndDropEvent, list?: any[]) {
    if (list && (event.dropEffect === 'copy' || event.dropEffect === 'move')) {
      let index = event.index;
      if (typeof index === 'undefined') {
        index = list.length;
      }
      const data = { ..._.findWhere(list, { id: event.data }) };

      // data.chart = _.findWhere(list, { id: event.data }).chart;
      data.id = this.GenerateID();
      list.splice(index, 0, data);
      console.log(data);
      setTimeout(() => {
        // this.setExtreme(this.minCurrentWaveformPoint, this.maxCurrentWaveformPoint, data);
      }, 1500);
    }
  }

  onDragged(item: any, list: any[], effect: DropEffect) {
    if (effect === 'move') {
      const index = list.findIndex(obj => obj.id === item);
      list.splice(index, 1);
    }

  }

  GenerateID(length = 5) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  }

  highchartsFactory() {
    const hc = require('highcharts');
    Highcharts.setOptions(this.theme)
    if (!hc.keyHighLoaded) {
      const hcm = require('highcharts/highcharts-more');
      const hs = require('highcharts/modules/stock');
      const dd = require('highcharts/modules/drilldown');
      const dde = require('highcharts/modules/exporting');
      const hm = require('highcharts/modules/heatmap');
      const tm = require('highcharts/modules/treemap');
      const ed = require('highcharts/modules/export-data');
      const oe = require('highcharts/modules/offline-exporting');
      const bst = require('highcharts/modules/boost');
      hcm(hc);
      hs(hc);
      dd(hc);
      dde(hc);
      hm(hc);
      tm(hc);
      ed(hc);
      oe(hc);
      bst(hc);
      hc.keyHighLoaded = true;
    }
    return hc;
  }
}
