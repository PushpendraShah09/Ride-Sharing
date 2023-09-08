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

      });
  }
}
