import { Component, OnInit } from '@angular/core';
import { HeroService } from '../hero.service';
import { Router } from '@angular/router';
import { Chart } from 'chart.js/auto';
import { CordysServiceService } from '../cordys-service.service';
declare var $: any;

@Component({
  selector: 'app-adminpage',
  templateUrl: './adminpage.component.html',
  styleUrls: ['./adminpage.component.scss'],
})
export class AdminpageComponent implements OnInit {
  // Pagination properties
  p: number = 1; // Number of items per page

  constructor(
    public hs: HeroService,
    public router: Router,
    private service: CordysServiceService
  ) {}

  DateInput: any = {};
  chart: any = [];
  ngOnInit(): void {
    this.City_wise_distribution_of_the_rides();
    this.Best_and_worst_rated_drivers_in_each_city_with_details();
    this.BestRatedDrivers();
    this.toggle(9);
  }

  array: any;
  array1: any;
  array2: any;

  CityWiseRide: any = [{}];
  city: any = [];
  Complete: any = [];
  Cancel: any = [];

  city1: any = [];
  Complete1: any = [];
  Cancel1: any = [];

  city2: any = [];
  Complete2: any = [];
  Cancel2: any = [];
  City_wise_distribution_of_the_rides() {
    const that = this;
    this.array = ['Complete', 'Cancel'];
    debugger;
    this.hs
      .ajax(
        'City_wise_distribution_of_the_rides',
        'http://schemas.cordys.com/WSAppServerPackageRS',
        {}
      )
      .then((resp) => {
        debugger;
        console.log(resp);

        that.CityWiseRide = that.hs.xmltojson(
          resp,
          'ride_transition_ridesharing'
        );
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

    this.array1 = ['Complete', 'Cancel'];

    debugger;
    this.hs
      .ajax(
        'Vehicle_category_wise_ride_distribution',
        'http://schemas.cordys.com/WSAppServerPackageRS',
        {}
      )
      .then((resp) => {
        console.log(resp);

        that.CityWiseRide = that.hs.xmltojson(
          resp,
          'ride_transition_ridesharing'
        );
        console.log('CityWiseRide =>', that.CityWiseRide);
        for (let i = 0; i < this.CityWiseRide.length; i++) {
          this.city1.push(this.CityWiseRide[i].vehiclecatogry);
          this.Complete1.push(this.CityWiseRide[i].complete);
          this.Cancel1.push(this.CityWiseRide[i].cancel);
        }
        this.createChart1();
      });
  }

  Rides_with_maximum_and_minimum_fares_in_each_city() {
    const that = this;
    this.array2 = ['Max Fare', 'Min Fare'];
    this.hs
      .ajax(
        'Rides_with_maximum_and_minimum_fares_in_each_city',
        'http://schemas.cordys.com/WSAppServerPackageRS',
        {}
      )
      .then((resp) => {
        console.log(resp);

        that.CityWiseRide = that.hs.xmltojson(
          resp,
          'ride_transition_ridesharing'
        );
        console.log('CityWiseRide =>', that.CityWiseRide);
        for (let i = 0; i < this.CityWiseRide.length; i++) {
          this.city2.push(this.CityWiseRide[i].currentcity);
          this.Complete2.push(this.CityWiseRide[i].max_fare);
          this.Cancel2.push(this.CityWiseRide[i].min_fare);
        }
        this.createChart2();
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

  createChart1() {
    this.ctx = document.getElementById('myChart1');

    this.myChart = new Chart(this.ctx, {
      type: 'bar',
      data: {
        labels: this.city1,
        datasets: [
          {
            label: this.array1[0],
            data: this.Complete1,
            backgroundColor: 'blue',
          },
          {
            label: this.array1[1],
            data: this.Cancel1,
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

  createChart2() {
    this.ctx = document.getElementById('myChart2');

    this.myChart = new Chart(this.ctx, {
      type: 'bar',
      data: {
        labels: this.city2,
        datasets: [
          {
            label: this.array2[0],
            data: this.Complete2,
            backgroundColor: 'blue',
          },
          {
            label: this.array2[1],
            data: this.Cancel2,
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

  isValue: number = 9;
  toggle(val: any) {
    this.isValue = val;
    // if (this.isValue == 1) {
    //   this.city = [];
    //   this.Complete = [];
    //   this.Cancel = [];
    //   this.City_wise_distribution_of_the_rides();
    // }
    // if (this.isValue == 2) {
    //   this.city = [];
    //   this.Complete = [];
    //   this.Cancel = [];
    //   this.Vehicle_category_wise_ride_distribution();
    // }
    // if (this.isValue == 4) {
    //   this.city = [];
    //   this.Complete = [];
    //   this.Cancel = [];
    //   this.Rides_with_maximum_and_minimum_fares_in_each_city();
    // }
    if (this.isValue == 6) {
      this.GetUser_master_ridesharingObjects();
    }
    if (this.isValue == 7) {
      this.GetRider_master_ridesharingObjects();
    }
    if (this.isValue == 8) {
      this.GetVehicleAllData();
    }
    if (this.isValue == 9) {
      this.city = [];
      this.Complete = [];
      this.Cancel = [];

      this.city1 = [];
      this.Complete1 = [];
      this.Cancel1 = [];

      this.city2 = [];
      this.Complete2 = [];
      this.Cancel2 = [];
      this.City_wise_distribution_of_the_rides();
      this.Vehicle_category_wise_ride_distribution();
      this.Rides_with_maximum_and_minimum_fares_in_each_city();
    }
    if (this.isValue == 10) {
      //this.GetVehicleAllData();
    }
  }

  driverRatingData: any;
  Best_and_worst_rated_drivers_in_each_city_with_details() {
    this.service
      .Best_and_worst_rated_drivers_in_each_city_with_details({})
      .then((resp: any) => {
        console.log(resp);
        debugger;

        this.driverRatingData = this.hs.xmltojson(
          resp,
          'ride_transition_ridesharing'
        );
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

  /* Table For User and Rider details */
  UserDetails: any;

  GetUser_master_ridesharingObjects() {
    debugger;
    this.hs
      .ajax(
        'GetUser_master_ridesharingObjects',
        'http://schemas.cordys.com/WSAppServerPackageRS',
        {
          fromId: '1',
          toId: '99999',
        }
      )
      .then((resp: any) => {
        this.UserDetails = this.hs.xmltojson(resp, 'user_master_ridesharing');
        console.log('Getuserdetails =>', this.UserDetails);
        this.filteredTableData = this.UserDetails;
      });
  }

  RiderDetails: any;

  GetRider_master_ridesharingObjects() {
    debugger;
    this.hs
      .ajax(
        'GetRider_master_ridesharingObjects',
        'http://schemas.cordys.com/WSAppServerPackageRS',
        {
          fromId: '1',
          toId: '99999',
        }
      )
      .then((resp: any) => {
        this.RiderDetails = this.hs.xmltojson(resp, 'rider_master_ridesharing');
        console.log('GetRiderdetails =>', this.UserDetails);
        this.filteredTableData = this.RiderDetails;
      });
  }

  filteredTableData: any;
  tableData: any;
  searchText: any;
  applySearchFilter() {
    debugger;
    this.filteredTableData = this.UserDetails.filter(
      (item: { [x: string]: any }) => {
        return Object.keys(item).some((key) => {
          const value = (item[key] || '').toString().toLowerCase();
          return value.includes(this.searchText.toLowerCase());
        });
      }
    );
  }

  applySearchFilter1() {
    debugger;
    this.filteredTableData = this.RiderDetails.filter(
      (item: { [x: string]: any }) => {
        return Object.keys(item).some((key) => {
          const value = (item[key] || '').toString().toLowerCase();
          return value.includes(this.searchText.toLowerCase());
        });
      }
    );
  }

  applySearchFilter2() {
    debugger;
    this.filteredTableData = this.VehicleData.filter(
      (item: { [x: string]: any }) => {
        return Object.keys(item).some((key) => {
          const value = (item[key] || '').toString().toLowerCase();
          return value.includes(this.searchText.toLowerCase());
        });
      }
    );
  }

  formatDate(inputDate: string): string {
    const dateParts = inputDate.split('-');
    if (dateParts.length === 3) {
      const year = dateParts[0];
      const month = dateParts[1];
      const day = dateParts[2];
      return `${day}-${month}-${year}`;
    } else {
      return inputDate; // Return as is if it's not in the expected format
    }
  }

  cancelRideD: any;

  TriggerService(DateInput: any) {
    this.DateInput.startDate = this.formatDate(DateInput.startDate);
    this.DateInput.endDate = this.formatDate(DateInput.endDate);

    this.hs
      .ajax(
        'Cancelled_ride_distribution_city_wise_in_a_duration',
        'http://schemas.cordys.com/WSAppServerPackageRS',
        {
          StartDate: this.DateInput.startDate,
          EndDate: this.DateInput.endDate,
        }
      )
      .then((resp: any) => {
        this.cancelRideD = this.hs.xmltojson(
          resp,
          'ride_transition_ridesharing'
        );
        debugger;
        $('#CRModal').modal('show');
      });
  }

  // Get reports of No of rides in a duration
  DateInput2: any = {};
  FileType: any = 'PDF';
  No_Of_Rides_In_a_Duration(DateInput2: any) {
    this.DateInput2.startDate = this.formatDate(DateInput2.startDate);
    this.DateInput2.endDate = this.formatDate(DateInput2.endDate);

    const PARAM1 = {
      PARAM: {
        Name: 'StartDate',
        Value: this.DateInput2.startDate,
      },
    };

    const PARAM2 = {
      PARAM: {
        Name: 'EndDate',
        Value: this.DateInput2.endDate,
      },
    };

    const paramsArray = [];
    paramsArray.push([PARAM1, PARAM2]);

    if (this.FileType == 'PDF') {
      debugger;
      this.hs
        .ajax('GetReport', 'http://schemas.cordys.com/BIRT/', {
          ReportName: 'NoOfRidesInDuration.rptdesign',
          OutputFormat: 'pdf',
          Embeddable: 'false',
          OutputToFile: 'true',
          EncodeFile: 'false',
          PARAMS: {
            PARAM: {
              paramsArray,
            },
          },
        })
        .then((resp: any) => {
          this.FileName = resp.PhysicalLink.split('/');
          this.FileName = this.FileName[4];

          debugger;
          this.DownloadFileFromServer();
        });
    } else {
      this.hs
        .ajax('GetReport', 'http://schemas.cordys.com/BIRT/', {
          ReportName: 'NoOfRidesInDuration.rptdesign',
          OutputFormat: 'xls',
          Embeddable: 'false',
          OutputToFile: 'true',
          EncodeFile: 'false',
          PARAMS: {
            PARAM: {
              paramsArray,
            },
          },
        })
        .then((resp: any) => {
          this.FileName = resp.PhysicalLink.split('/');
          this.FileName = this.FileName[4];

          debugger;
          this.DownloadFileFromServer();
        });
    }
  }

  // Report of No_of_cancelled_rides_in_a_duration
  DateInput1: any = {};
  CancelFileType: any = 'PDF';
  No_of_cancelled_rides_in_a_duration(DateInput1: any) {
    this.DateInput1.startDate = this.formatDate(DateInput1.startDate);
    this.DateInput1.endDate = this.formatDate(DateInput1.endDate);

    const PARAM1 = {
      PARAM: {
        Name: 'StartDate',
        Value: this.DateInput1.startDate,
      },
    };

    const PARAM2 = {
      PARAM: {
        Name: 'EndDate',
        Value: this.DateInput1.endDate,
      },
    };

    const paramsArray = [];
    paramsArray.push([PARAM1, PARAM2]);

    if (this.CancelFileType == 'PDF') {
      debugger;
      this.hs
        .ajax('GetReport', 'http://schemas.cordys.com/BIRT/', {
          ReportName: 'NoOfCancelRidesInDuration.rptdesign',
          OutputFormat: 'pdf',
          Embeddable: 'false',
          OutputToFile: 'true',
          EncodeFile: 'false',
          PARAMS: {
            PARAM: {
              paramsArray,
            },
          },
        })
        .then((resp: any) => {
          this.FileName = resp.PhysicalLink.split('/');
          this.FileName = this.FileName[4];

          debugger;
          this.DownloadFileFromServer();
        });
    } else {
      this.hs
        .ajax('GetReport', 'http://schemas.cordys.com/BIRT/', {
          ReportName: 'NoOfCancelRidesInDuration.rptdesign',
          OutputFormat: 'xls',
          Embeddable: 'false',
          OutputToFile: 'true',
          EncodeFile: 'false',
          PARAMS: {
            PARAM: {
              paramsArray,
            },
          },
        })
        .then((resp: any) => {
          this.FileName = resp.PhysicalLink.split('/');
          this.FileName = this.FileName[4];

          debugger;
          this.DownloadFileFromServer();
        });
    }
  }

  VehicleData: any = [{}];
  GetVehicleAllData() {
    debugger;
    this.hs
      .ajax(
        'GetVehicleAllData',
        'http://schemas.cordys.com/WSAppServerPackageRS',
        {}
      )
      .then((resp) => {
        console.log(resp);

        this.VehicleData = this.hs.xmltojson(
          resp,
          'vehicle_master_ridesharing'
        );
        this.filteredTableData = this.VehicleData;
        console.log('Vehicle Data => ', this.VehicleData);
      });
  }

  vehicleCategory: string = '';
  vehicleType: string = '';
  AddVehicle() {
    debugger;
    this.hs
      .ajax(
        'AddVehicleMaster',
        'http://schemas.cordys.com/WSAppServerPackageRS',
        {
          Category: this.vehicleCategory,
          Type: this.vehicleType,
        }
      )
      .then((resp: any) => {
        console.log(resp);
        debugger;

        this.GetVehicleAllData();

        this.hs.toast({
          title: 'Success!',
          text: 'Vehicle added Successfully.',
          icon: 'success',
          toast: true,
          position: 'top-end',
          timer: 2000,
          showConfirmButton: false,
        });
      });
  }

  EditRow: any = [{}];
  editVehicle(item: any) {
    debugger;
    console.log('Editing row:', item);
    this.EditRow = item;
    $('#EditModal').modal('show');
  }

  EditVehicleData() {
    debugger;
    this.hs
      .ajax(
        'UpdateVehicle_master_ridesharing',
        'http://schemas.cordys.com/WSAppServerPackageRS',
        {
          tuple: {
            old: {
              vehicle_master_ridesharing: {
                id: this.EditRow.id,
              },
            },
            new: {
              vehicle_master_ridesharing: {
                category: this.EditRow.category,
                type: this.EditRow.type,
              },
            },
          },
        }
      )
      .then((resp: any) => {
        console.log(resp);
        debugger;

        this.GetVehicleAllData();

        this.hs.toast({
          title: 'Success!',
          text: 'Vehicle Data Edited Successfully.',
          icon: 'success',
          toast: true,
          position: 'top-end',
          timer: 2000,
          showConfirmButton: false,
        });
      });
  }

  DeleteRow: any = [{}];
  deleteVehicle(item: any) {
    console.log('Deleting row:', item);
    this.DeleteRow = item;
    $('#DeleteModal').modal('show');
  }

  DeleteVehicleData() {
    this.hs
      .ajax(
        'UpdateVehicle_master_ridesharing',
        'http://schemas.cordys.com/WSAppServerPackageRS',
        {
          tuple: {
            old: {
              vehicle_master_ridesharing: {
                id: this.DeleteRow.id,
              },
            },
          },
        }
      )
      .then((resp: any) => {
        console.log(resp);
        debugger;

        this.GetVehicleAllData();

        this.hs.toast({
          title: 'Success!',
          text: 'Vehicle data deleted Successfully.',
          icon: 'success',
          toast: true,
          position: 'top-end',
          timer: 2000,
          showConfirmButton: false,
        });
      });
  }

  //Best Rated Driver List
  BestRatingsInfo: any;
  BestRatedDrivers() {
    debugger;
    this.hs
      .ajax(
        'BestRatedDrivers',
        'http://schemas.cordys.com/WSAppServerPackageRS',
        {}
      )
      .then((resp) => {
        this.BestRatingsInfo = this.hs.xmltojson(
          resp,
          'ride_transition_ridesharing'
        );
        console.log('Best Rated Driver Info ->', this.BestRatingsInfo);
      });
  }

  BestRatedDriverListPDF() {
    const that = this;
    debugger;
    this.hs
      .ajax('GetReport', 'http://schemas.cordys.com/BIRT/', {
        ReportName: 'BestRatedDrivers.rptdesign',
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

  BestRatedDriverListXLS() {
    const that = this;
    debugger;
    this.hs
      .ajax('GetReport', 'http://schemas.cordys.com/BIRT/', {
        ReportName: 'BestRatedDrivers.rptdesign',
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
