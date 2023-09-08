import { Component, OnInit } from '@angular/core';
import { HeroService } from '../hero.service';
import { Router } from '@angular/router';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-adminpage',
  templateUrl: './adminpage.component.html',
  styleUrls: ['./adminpage.component.scss']
})
export class AdminpageComponent implements OnInit {
  constructor(public hs: HeroService, public router: Router) { }

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

    debugger;
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
  Vehicle_category_wise_ride_distribution() {
    const that = this;
    debugger;
    this.hs
      .ajax(
        'Vehicle_category_wise_ride_distribution',
        'http://schemas.cordys.com/WSAppServerPackageRS',
        {}
      )
      .then((resp) => {
        console.log(resp);

        that.CityWiseRide = that.hs.xmltojson(resp, 'ride_transition_ridesharing');
        console.log('CityWiseRide =>', that.CityWiseRide);
        for (let i = 0; i < this.CityWiseRide.length; i++) {
          this.city.push(this.CityWiseRide[i].vehiclecatogry);
          this.Complete.push(this.CityWiseRide[i].complete);
          this.Cancel.push(this.CityWiseRide[i].cancel);
        }
        this.createChart();
      });
  }
  Rides_with_maximum_and_minimum_fares_in_each_city() {
    const that = this;

    this.hs
      .ajax(
        'Rides_with_maximum_and_minimum_fares_in_each_city',
        'http://schemas.cordys.com/WSAppServerPackageRS',
        {}
      )
      .then((resp) => {
        console.log(resp);

        that.CityWiseRide = that.hs.xmltojson(resp, 'ride_transition_ridesharing');
        console.log('CityWiseRide =>', that.CityWiseRide);
        for (let i = 0; i < this.CityWiseRide.length; i++) {
          this.city.push(this.CityWiseRide[i].currentcity);
          this.Complete.push(this.CityWiseRide[i].max_fare);
          this.Cancel.push(this.CityWiseRide[i].min_fare);
        }
        this.createChart();
      });
  }

  ctx: any;
  myChart: any;
  createChart() {
    this.ctx = document.getElementById('myChart');

    this.myChart = new Chart(this.ctx, {
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
  isValue: number = 1
  toggle(val: any) {
    this.isValue = val
    if (this.isValue == 1) {
      this.city = [];
      this.Complete = [];
      this.Cancel = [];
      this.City_wise_distribution_of_the_rides()

    }
    if (this.isValue == 2) {
      this.city = [];
      this.Complete = [];
      this.Cancel = [];
      this.Vehicle_category_wise_ride_distribution()

    }
    if (this.isValue == 4) {
      this.city = [];
      this.Complete = [];
      this.Cancel = [];
      this.Rides_with_maximum_and_minimum_fares_in_each_city()

    }
  }







}



