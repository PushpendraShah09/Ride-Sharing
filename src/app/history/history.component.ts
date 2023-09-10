import { Component, OnInit } from '@angular/core';
import { HeroService } from '../hero.service';
import { CordysServiceService } from '../cordys-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  constructor(public hs: HeroService, public router: Router, private service: CordysServiceService) { }

  riderHistoryData: any
  userHistoryData: any
  GetRiderHistory() {
    this.service.GetRiderHistory({RideName:'pushpendra'})
      .then((resp: any) => {
        console.log(resp);
        debugger

        this.riderHistoryData = this.hs.xmltojson(resp, 'ride_transition_ridesharing');

        debugger;
      });
  }

  GetUserHistory () {
    this.service.GetUserHistory ({UserName:'rahul'})
      .then((resp: any) => {
        console.log(resp);
        debugger

        this.userHistoryData = this.hs.xmltojson(resp, 'ride_transition_ridesharing');

        debugger;
      });
  }
  userRole:any
  ngOnInit() {
    this.hs.callToggle.subscribe((role) => {
      console.log(role);
      this.userRole = role;

    })
    this.GetRiderHistory();
    this.GetUserHistory();

  }


}
