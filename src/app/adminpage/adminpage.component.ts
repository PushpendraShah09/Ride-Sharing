import { Component, OnInit } from '@angular/core';
import { HeroService } from '../hero.service';
import { Router } from '@angular/router';
import { Chart } from 'chart.js/auto';
import { CordysServiceService } from '../cordys-service.service';

@Component({
  selector: 'app-adminpage',
  templateUrl: './adminpage.component.html',
  styleUrls: ['./adminpage.component.scss']
})
export class AdminpageComponent implements OnInit {
  // Pagination properties
  p: number = 1; // Number of items per page


  constructor(public hs: HeroService, public router: Router, private service: CordysServiceService) { }

  chart: any = []
  ngOnInit(): void {
    this.City_wise_distribution_of_the_rides();
    this.Best_and_worst_rated_drivers_in_each_city_with_details();

  }

  array :any;
  CityWiseRide: any = [{}];
  city: any = [];
  Complete: any = [];
  Cancel: any = [];
  City_wise_distribution_of_the_rides() {
    const that = this;
    this.array = ["Complete","Cancel" ]
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

    this.array = ["Complete","Cancel" ]

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
    this.array = ["Max Fare","Min Fare" ]
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
            label: this.array[0],
            data: this.Complete,
            backgroundColor: 'blue',
          },
          {
            label: this.array[1],
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

  driverRatingData: any
  Best_and_worst_rated_drivers_in_each_city_with_details() {
    this.service.Best_and_worst_rated_drivers_in_each_city_with_details({})
      .then((resp: any) => {
        console.log(resp);
        debugger

        this.driverRatingData = this.hs.xmltojson(resp, 'ride_transition_ridesharing');


      });
  }

  getStarRating(rating: number): string {
    const maxRating = 5;
    const starCount = Math.round(rating); // Round the rating to the nearest integer
    return '★'.repeat(starCount) + '☆'.repeat(maxRating - starCount);
  }

// Download From Server
Path =
'C:\\OPENTEXT\\AppWorksPlatform\\defaultInst\\webroot\\organization\\trainingjulaug2022/birt/reports/reportFiles/';
DownloadFileFromServer() {
debugger;
this.hs
  .ajax('DownloadFile', 'http://schemas.cordys.com/WSAppServerPackageRS', {
    Fname: this.FileName,
    Fpath: this.Path,
  })
  .then((resp: any) => {
    this.arr = this.hs.xmltojson(resp, 'DownloadFile');
    this.base64 = this.arr[0].DownloadFile;

    const byteCharacters = atob(this.base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], {
      type: 'application/octet-stream',
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = this.FileName;
    a.click();
    window.URL.revokeObjectURL(url);
    debugger;
  });
}

/* Birt File Download From Server In PDF Format */

// Download Birt for City wise distribution of the rides in pdf
   FileName: any;
   arr: any;
   base64: any;
   GetReportForCitywisedistributionoftherides() {
     const that = this;
     debugger;
     this.hs
       .ajax('GetReport', 'http://schemas.cordys.com/BIRT/', {
         ReportName: 'Citywisedistributionoftherides.rptdesign',
         OutputFormat: 'pdf',
         Embeddable: 'false',
         OutputToFile: 'true',
         EncodeFile: 'false',
       })
       .then((resp: any) => {
         this.FileName = resp.PhysicalLink.split('/');
         this.FileName = this.FileName[4];
        
         debugger;
         this.DownloadFileFromServer();
       });
   }


// Download Birt for Vehicle category wise ride distribution  in pdf
GetReportForVehiclecategorywiseridedistribution() {
  const that = this;
  debugger;
  this.hs
    .ajax('GetReport', 'http://schemas.cordys.com/BIRT/', {
      ReportName: 'Vehiclecategorywiseridedistribution.rptdesign',
      OutputFormat: 'pdf',
      Embeddable: 'false',
      OutputToFile: 'true',
      EncodeFile: 'false',
    })
    .then((resp: any) => {
      this.FileName = resp.PhysicalLink.split('/');
      this.FileName = this.FileName[4];
     
      debugger;
      this.DownloadFileFromServer();
    });
}

// Download Birt for Rides with maximum and minimum fares in each city in pdf
GetReportForRideswithmaximumandminimumfaresineachcity() {
  const that = this;
  debugger;
  this.hs
    .ajax('GetReport', 'http://schemas.cordys.com/BIRT/', {
      ReportName: 'Rideswithmaximumandminimumfaresineachcity.rptdesign',
      OutputFormat: 'pdf',
      Embeddable: 'false',
      OutputToFile: 'true',
      EncodeFile: 'false',
    })
    .then((resp: any) => {
      this.FileName = resp.PhysicalLink.split('/');
      this.FileName = this.FileName[4];
     
      debugger;
      this.DownloadFileFromServer();
    });
}

// Download Birt for Best and worst rated drivers in each city with details in pdf
GetReportForBestandworstrateddriversineachcitywithdetails() {
  const that = this;
  debugger;
  this.hs
    .ajax('GetReport', 'http://schemas.cordys.com/BIRT/', {
      ReportName: 'Bestandworstrateddriversineachcitywithdetails..rptdesign',
      OutputFormat: 'pdf',
      Embeddable: 'false',
      OutputToFile: 'true',
      EncodeFile: 'false',
    })
    .then((resp: any) => {
      this.FileName = resp.PhysicalLink.split('/');
      this.FileName = this.FileName[4];
     
      debugger;
      this.DownloadFileFromServer();
    });
}


/* Birt File Download From Server In XLS Format */

// Download Birt for City wise distribution of the rides in XLS
GetReportForCitywisedistributionoftheridesInXLS() {
  const that = this;
  debugger;
  this.hs
    .ajax('GetReport', 'http://schemas.cordys.com/BIRT/', {
      ReportName: 'Citywisedistributionoftherides.rptdesign',
      OutputFormat: 'xls',
      Embeddable: 'false',
      OutputToFile: 'true',
      EncodeFile: 'false',
    })
    .then((resp: any) => {
      this.FileName = resp.PhysicalLink.split('/');
      this.FileName = this.FileName[4];
     
      debugger;
      this.DownloadFileFromServer();
    });
}


// Download Birt for Vehicle category wise ride distribution in XLS
GetReportForVehiclecategorywiseridedistributionInXLS() {
const that = this;
debugger;
this.hs
 .ajax('GetReport', 'http://schemas.cordys.com/BIRT/', {
   ReportName: 'Vehiclecategorywiseridedistribution.rptdesign',
   OutputFormat: 'xls',
   Embeddable: 'false',
   OutputToFile: 'true',
   EncodeFile: 'false',
 })
 .then((resp: any) => {
   this.FileName = resp.PhysicalLink.split('/');
   this.FileName = this.FileName[4];
  
   debugger;
   this.DownloadFileFromServer();
 });
}

// Download Birt for Rides with maximum and minimum fares in each city in XLS
GetReportForRideswithmaximumandminimumfaresineachcityInXLS() {
const that = this;
debugger;
this.hs
 .ajax('GetReport', 'http://schemas.cordys.com/BIRT/', {
   ReportName: 'Rideswithmaximumandminimumfaresineachcity.rptdesign',
   OutputFormat: 'xls',
   Embeddable: 'false',
   OutputToFile: 'true',
   EncodeFile: 'false',
 })
 .then((resp: any) => {
   this.FileName = resp.PhysicalLink.split('/');
   this.FileName = this.FileName[4];
  
   debugger;
   this.DownloadFileFromServer();
 });
}

// Download Birt for Best and worst rated drivers in each city with details in XLS
GetReportForBestandworstrateddriversineachcitywithdetailsInXLS() {
const that = this;
debugger;
this.hs
 .ajax('GetReport', 'http://schemas.cordys.com/BIRT/', {
   ReportName: 'Bestandworstrateddriversineachcitywithdetails..rptdesign',
   OutputFormat: 'xls',
   Embeddable: 'false',
   OutputToFile: 'true',
   EncodeFile: 'false',
 })
 .then((resp: any) => {
   this.FileName = resp.PhysicalLink.split('/');
   this.FileName = this.FileName[4];
  
   debugger;
   this.DownloadFileFromServer();
 });
}

}



