import { Component, OnInit } from '@angular/core';
import { HeroService } from '../hero.service';
import { CordysServiceService } from '../cordys-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})
export class HistoryComponent implements OnInit {
  constructor(
    public hs: HeroService,
    public router: Router,
    private service: CordysServiceService
  ) {}

  riderHistoryData: any;
  userHistoryData: any;
  GetRiderHistory() {
    this.service
      .GetRiderHistory({ RideName: 'pushpendra' })
      .then((resp: any) => {
        console.log(resp);
        debugger;

        this.riderHistoryData = this.hs.xmltojson(
          resp,
          'ride_transition_ridesharing'
        );

        debugger;
      });
  }

  GetUserHistory() {
    this.service.GetUserHistory({ UserName: 'rahul' }).then((resp: any) => {
      console.log(resp);
      debugger;

      this.userHistoryData = this.hs.xmltojson(
        resp,
        'ride_transition_ridesharing'
      );
      this.filteredTableData = this.userHistoryData;

      debugger;
    });
  }
  userRole: any;
  ngOnInit() {
    this.userRole = localStorage.getItem('userRole');

    this.GetRiderHistory();
    this.GetUserHistory();
  }

  filteredTableData: any[] = []; // Initialize as an empty array
  tableData: any[] = []; // Initialize with your data
  searchText: string = ''; // Initialize searchText as an empty string

  applySearchFilter() {
    debugger;
    this.filteredTableData = this.userHistoryData.filter((item: any) => {
      return Object.keys(item).some((key) => {
        const value = (item[key] || '').toString().toLowerCase();
        return value.includes(this.searchText.toLowerCase());
      });
    });
  }
}
