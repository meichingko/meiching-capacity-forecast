import { Component } from '@angular/core';
import { Http } from '@angular/http';

// import * as index from 'pixie-transformer';
import highcharts from 'highcharts';
@Component({
  selector: 'login',
  template: `
    <h1>Login</h1>
  `,
})
export class LoginViewComponent {
   constructor(private http: Http) {
    highcharts['seriesTypes']['line'].prototype.drawLegendSymbol = highcharts['seriesTypes']['column'].prototype.drawLegendSymbol


   }
}
