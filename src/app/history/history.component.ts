import { Component, OnInit } from '@angular/core';
import { HeroService } from '../hero.service';
import { CordysServiceService } from '../cordys-service.service';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})
export class HistoryComponent implements OnInit {
  // Pagination properties
  p: number = 1; // Number of items per page

  constructor(
    public hs: HeroService,
    public router: Router,
    private service: CordysServiceService
  ) {}

  userName: any;
  UserRole: any;
  ngOnInit() {
    this.UserRole = localStorage.getItem('userRole');
    this.userName = localStorage.getItem('UserName');

    this.GetRiderHistory();
    this.GetUserHistory();
  }

  riderHistoryData: any;
  userHistoryData: any;
  GetRiderHistory() {
    debugger;
    this.service
      .GetRiderHistory({ RideName: this.userName })
      .then((resp: any) => {
        console.log(resp);
        debugger;

        this.riderHistoryData = this.hs.xmltojson(
          resp,
          'ride_transition_ridesharing'
        );
        this.filteredTableData = this.riderHistoryData;

        debugger;
      });
  }

  GetUserHistory() {
    this.service
      .GetUserHistory({ UserName: this.userName })
      .then((resp: any) => {
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

  filteredTableData: any[] = []; // Initialize as an empty array
  tableData: any[] = []; // Initialize with your data
  searchText: string = ''; // Initialize searchText as an empty string

  applySearchFilter() {
    if (this.UserRole == 'userRS') {
      debugger;
      this.filteredTableData = this.userHistoryData.filter((item: any) => {
        return Object.keys(item).some((key) => {
          const value = (item[key] || '').toString().toLowerCase();
          return value.includes(this.searchText.toLowerCase());
        });
      });
    } else if (this.UserRole == 'RiderRS') {
      debugger;
      this.filteredTableData = this.riderHistoryData.filter((item: any) => {
        return Object.keys(item).some((key) => {
          const value = (item[key] || '').toString().toLowerCase();
          return value.includes(this.searchText.toLowerCase());
        });
      });
    }
  }

  FileName: any;
  arr: any;
  base64: any;
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

  /* Get Row data on row click by User able */
  UserRowData: any =[{}];
  onRowClickForUser(item: any) {
    debugger;
    console.log('Row clicked:', item);
    this.UserRowData = item;
    $('#userModal').modal('show');
  }

  //User History Birt PDF
  GetUserHistoryBirtPDF() {
    const that = this;
    debugger;
    this.hs
      .ajax('GetReport', 'http://schemas.cordys.com/BIRT/', {
        ReportName: 'UserHistory.rptdesign',
        OutputFormat: 'pdf',
        Embeddable: 'false',
        OutputToFile: 'true',
        EncodeFile: 'false',
        PARAMS: {
          PARAM: {
            Name: 'UserName',
            Value: this.userName,
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

  // User History Birt In XLS
  GetUserHistoryBirtXLS() {
    const that = this;
    debugger;
    this.hs
      .ajax('GetReport', 'http://schemas.cordys.com/BIRT/', {
        ReportName: 'UserHistory.rptdesign',
        OutputFormat: 'xls',
        Embeddable: 'false',
        OutputToFile: 'true',
        EncodeFile: 'false',
        PARAMS: {
          PARAM: {
            Name: 'UserName',
            Value: this.userName,
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

   //User Invoice Birt PDF
   GetUserInvoicePDF() {
    const that = this;
    debugger;
    this.hs
      .ajax('GetReport', 'http://schemas.cordys.com/BIRT/', {
        ReportName: 'UserInvoice.rptdesign',
        OutputFormat: 'pdf',
        Embeddable: 'false',
        OutputToFile: 'true',
        EncodeFile: 'false',
        PARAMS: {
          PARAM: {
            Name: 'RideId',
            Value: this.UserRowData.transition_id,
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

  //User Invoice Birt Xls
  GetUserInvoiceXLS() {
    const that = this;
    debugger;
    this.hs
      .ajax('GetReport', 'http://schemas.cordys.com/BIRT/', {
        ReportName: 'UserInvoice.rptdesign',
        OutputFormat: 'xls',
        Embeddable: 'false',
        OutputToFile: 'true',
        EncodeFile: 'false',
        PARAMS: {
          PARAM: {
            Name: 'RideId',
            Value: this.UserRowData.transition_id,
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

  //Rider History Birt PDF
  GetRiderHistoryBirtPDF() {
    const that = this;
    debugger;
    this.hs
      .ajax('GetReport', 'http://schemas.cordys.com/BIRT/', {
        ReportName: 'RiderHistory.rptdesign',
        OutputFormat: 'pdf',
        Embeddable: 'false',
        OutputToFile: 'true',
        EncodeFile: 'false',
        PARAMS: {
          PARAM: {
            Name: 'RiderName',
            Value: this.userName,
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

  // Rider History Birt In XLS
  GetRiderHistoryBirtXLS() {
    const that = this;
    debugger;
    this.hs
      .ajax('GetReport', 'http://schemas.cordys.com/BIRT/', {
        ReportName: 'RiderHistory.rptdesign',
        OutputFormat: 'xls',
        Embeddable: 'false',
        OutputToFile: 'true',
        EncodeFile: 'false',
        PARAMS: {
          PARAM: {
            Name: 'RiderName',
            Value: this.userName,
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


  //Rider Invoice Birt PDF
  GetRiderInvoicePDF() {
    const that = this;
    debugger;
    this.hs
      .ajax('GetReport', 'http://schemas.cordys.com/BIRT/', {
        ReportName: 'RiderInvoice.rptdesign',
        OutputFormat: 'pdf',
        Embeddable: 'false',
        OutputToFile: 'true',
        EncodeFile: 'false',
        PARAMS: {
          PARAM: {
            Name: 'RideId',
            Value: this.RiderRowData.transition_id,
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

  //Rider Invoice Birt Xls
  GetRiderInvoiceXLS() {
    const that = this;
    debugger;
    this.hs
      .ajax('GetReport', 'http://schemas.cordys.com/BIRT/', {
        ReportName: 'RiderInvoice.rptdesign',
        OutputFormat: 'xls',
        Embeddable: 'false',
        OutputToFile: 'true',
        EncodeFile: 'false',
        PARAMS: {
          PARAM: {
            Name: 'RideId',
            Value: this.RiderRowData.transition_id,
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

  /* Get Row data on row click by rider able */
  RiderRowData: any =[{}];
  onRowClickForRider(item: any) {
    console.log('Row clicked:', item);
    this.RiderRowData = item;
    debugger;
    $('#RiderModal').modal('show');
  }

  UpdateRiderRating(){
    this.hs
    .ajax(
      'UpdateRide_transition_ridesharing',
      'http://schemas.cordys.com/WSAppServerPackageRS',
      {
        tuple: {
          old: {
            ride_transition_ridesharing: {
              transition_id: this.UserRowData.transition_id,
            }
          },
          new: {
            ride_transition_ridesharing: {
              rateddriver: this.UserRowData.rateddriver,
            },
          },
        },
    }
    )
    .then((resp: any) => {
      console.log(resp);
      debugger;

      this.hs.toast({
        title: 'Success!',
        text: 'Rider Rating Updated Successfully.',
        icon: 'success',
        toast: true,
        position: 'top-end',
        timer: 2000,
        showConfirmButton: false,
      });
    });
  }
}
