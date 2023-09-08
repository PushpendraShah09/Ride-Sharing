import { Component, OnInit } from '@angular/core';
import { HeroService } from '../hero.service';
import { Router } from '@angular/router';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-adminpage',
  templateUrl: './adminpage.component.html',
  styleUrls: ['./adminpage.component.scss']
})
export class AdminpageComponent implements OnInit{
  constructor(public hs: HeroService, public router: Router) {}

  chart: any = []
  ngOnInit(): void {
    this.City_wise_distribution_of_the_rides();
  }
 
  CityWiseRide: any = [{}];
  city: any = [];
  Complete: any = [];
  Cancel: any = [];
 
  City_wise_distribution_of_the_rides() {
    const that = this;
    this.hs
      .ajax(
        'City_wise_distribution_of_the_rides',
        'http://schemas.cordys.com/WSAppServerPackageRS',
        {}
      )
      .then((resp) => {
        debugger
        console.log(resp);

        that.CityWiseRide = that.hs.xmltojson(resp, 'ride_transition_ridesharing');
        console.log('CityWiseRide =>', that.CityWiseRide);
        //debugger;
        for (let i = 0; i < this.CityWiseRide.length; i++) {
          this.city.push(this.CityWiseRide[i].currentcity);
          this.Complete.push(this.CityWiseRide[i].complete);
          this.Cancel.push(this.CityWiseRide[i].cancel);
        }
        this.createChart();
      });
  }
  
  ctx: any;
  createChart() {
    this.ctx = document.getElementById('myChart');

    new Chart(this.ctx, {
      type: 'bar',
      data: {
        labels: this.city,
        datasets: [
          {
            label: 'Complete',
            data: this.Complete,
            backgroundColor: 'blue',
          },
          {
            label: 'Cancel',
            data: this.Cancel,
            backgroundColor: 'limegreen',
          },
        ],
      },
      options: {
        scales: {
          y: {
            //beginAtZero: true,
            suggestedMin: 0,
            suggestedMax: 5,
          },
        },
      },
    });
  }
}



