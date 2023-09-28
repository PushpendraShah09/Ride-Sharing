import { Component, OnInit } from '@angular/core';
import { HeroService } from '../hero.service';
import { Router } from '@angular/router';
import { CordysServiceService } from '../cordys-service.service';

declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isDropdownOpen = false;
   userInfo: any = [{}];

  constructor(
    public hs: HeroService,
    public router: Router,
    private service: CordysServiceService,
  ) {}


  userRole: any;
  USERNAME: any;
  ngOnInit() {
    this.UserInfo();

    this.service.isDropdownOpen$.subscribe((isOpen) => {
      this.isDropdownOpen = isOpen;
    });

    debugger;

    this.userRole = localStorage.getItem('userRole');
  
    debugger;
    this.hs.callToggle.subscribe((role) => {
      console.log(role);
      this.userRole = role;
      // this.UserInfo();
    });
    // this.userRole = localStorage.getItem('userRole');
  }

  toggleDropdown(): void {
    this.USERNAME = localStorage.getItem('UserName');
    this.service.toggleDropdown();
  }

  isValue: number = 1;

  toggle1() {
    debugger;
    this.isValue = 1;
  }

  toggle2() {
    this.isValue = 2;
  }

  toggle3() {
    this.isValue = 3;
  }

  toggle4() {
    this.isValue = 4;
  }
  toggle5() {
    this.isValue = 5;
  }
  toggle6() {
    this.isValue = 6;
  }

  UserRole: any;
  Logout() {
    this.service.toggleDropdown();
    // localStorage.removeItem('userRole');
    // localStorage.clear()
    this.UserRole = '';
    localStorage.setItem('userRole', this.UserRole);
    this.hs.callToggle.next(this.UserRole);
    debugger;
    var c_a = document.cookie.split(';').map((cookie) => cookie.split('='));
    var c = 0;
    while (c < c_a.length) {
      var c_a_name = c_a[c][0];
      document.cookie =
        c_a_name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
      c++;
    }
    this.router.navigateByUrl('/home');
  }

  editProfile() {
    localStorage.getItem('userRole');
    this.UserInfo();

    if (this.userRole == 'RiderRS') {
      $('#RiderInfoModal').modal('show');
    } else if (this.userRole == 'userRS') {
      $('#UserInfoModal').modal('show');
    }
  }


  UserInfo() {
    debugger;
    var name = localStorage.getItem('UserName');

    if (this.userRole == 'userRS') {
      this.hs
        .ajax(
          'GetUserInfoByUserName',
          'http://schemas.cordys.com/WSAppServerPackageRS',
          {
            UserName: name,
          }
        )
        .then((resp: any) => {
          this.userInfo = this.hs.xmltojson(resp, 'user_master_ridesharing');
          console.log('UserInfo =>', this.userInfo);
        });
    } else if (this.userRole == 'RiderRS') {
      this.hs
        .ajax(
          'GetRiderInfoBYName',
          'http://schemas.cordys.com/WSAppServerPackageRS',
          {
            RiderName: name,
          }
        )
        .then((resp: any) => {
          this.userInfo = this.hs.xmltojson(resp, 'rider_master_ridesharing');
          console.log('RiderInfo =>', this.userInfo);
        });
    }
  }


  validateInputFields() {
    localStorage.getItem('userRole');
    const emptyFields = [];
  
    // Validate email using a regular expression
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const isInvalidEmail = !emailRegex.test(this.userInfo[0].email);
  
    // Validate mobile number using a regular expression for 10 digits
    const mobileRegex = /^\d{10}$/;
    const isInvalidMobile = !mobileRegex.test(this.userInfo[0].mobileno);

     // Validate age to be above 10
  const age = parseInt(this.userInfo[0].age); // Assuming age is a string, convert it to a number
  const isInvalidAge = isNaN(age) || age < 18;
  
    if (isInvalidEmail) {
      emptyFields.push('Invalid Email');
    }
  
    if (isInvalidMobile) {
      emptyFields.push('Invalid Mobile Number');
    }

    if (isInvalidAge) {
      emptyFields.push('Age must be above 18');
    }
  
    if (emptyFields.length > 0) {
      this.hs.toast({
        position: 'top-end',
        icon: 'error',
        toast: true,
        title: `The following fields are invalid: ${emptyFields.join(' | ')}`,
        showConfirmButton: false,
        timer: 2000,
      });
    }
   else if(this.userRole == 'userRS') {
      this.UpdateUserInfo();
    }
    else if(this.userRole == 'RiderRS'){
      this. UpdateRiderInfo();
    }
  }
  

  UpdateUserInfo(){
    debugger;
    this.hs
      .ajax(
        'UpdateUser_master_ridesharing',
        'http://schemas.cordys.com/WSAppServerPackageRS',
        {
          tuple: {
            old: {
              user_master_ridesharing: {
               id: this.userInfo[0].id,
              },
            },
            new: {
              user_master_ridesharing: {
               email: this.userInfo[0].email,
               mobileno: this.userInfo[0].mobileno,
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
          text: 'Your Profile Updated Successfully.',
          icon: 'success',
          toast: true,
          position: 'top-end',
          timer: 2000,
          showConfirmButton: false,
        });
      });
  }

  UpdateRiderInfo(){
    debugger;
    this.hs
      .ajax(
        'UpdateRider_master_ridesharing',
        'http://schemas.cordys.com/WSAppServerPackageRS',
        {
          tuple: {
            old: {
              rider_master_ridesharing : {
               id: this.userInfo[0].id,
              },
            },
            new: {
              rider_master_ridesharing : {
                age: this.userInfo[0].age,
                email: this.userInfo[0].email,
                mobileno: this.userInfo[0].mobileno,
                city: this.userInfo[0].city,
                pincode: this.userInfo[0].pincode,
                state: this.userInfo[0].state,
                drivinglicence: this.userInfo[0].drivinglicence,
                vehiclecategory: this.userInfo[0].vehiclecategory,
                vehiclemodel: this.userInfo[0].vehiclemodel,
                vehicleno: this.userInfo[0].vehicleno,
                lat: 26.8849,
                lng: 75.7675,
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
          text: 'Your Profile Updated Successfully.',
          icon: 'success',
          toast: true,
          position: 'top-end',
          timer: 2000,
          showConfirmButton: false,
        });
      });
  }
}
