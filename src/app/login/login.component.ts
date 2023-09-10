import { Component, OnInit } from '@angular/core';
import { HeroService } from '../hero.service';
import { Router } from '@angular/router';
import { CordysServiceService } from '../cordys-service.service';
declare var $: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(
    public hs: HeroService,
    public router: Router,
    private service: CordysServiceService
  ) {}
  ngOnInit(): void {
    const sign_in_btn = document.querySelector('#sign-in-btn');
    const sign_up_btn = document.querySelector('#sign-up-btn');
    const container = document.querySelector('.container');

    sign_up_btn!.addEventListener('click', () => {
      container!.classList.add('sign-up-mode');
    });

    sign_in_btn!.addEventListener('click', () => {
      container!.classList.remove('sign-up-mode');
    });
  }

  data: any = {
    user: '',
    pass: '',
    role: '',
  };

  NewUser: any = {
    username: '',
    email: '',
    password: '',
    role: '',
  };

  login(data: any) {
    debugger;
    const that = this;
    console.log('show=>', this.data);
    $.cordys.authentication.sso
      .authenticate(this.data.user, this.data.pass)
      .done((resp: any) => {
        this.GetUserDetails();
      });
  }

  UserData: any;
  UserRole: any;
  GetUserDetails() {
    this.service.GetUserDetails({ UserName: this.data.user }).then((resp) => {
      console.log(resp);
      this.UserData = this.hs.xmltojson(resp, 'Roles');
      debugger;
      this.UserRole = this.UserData[0].Role[5].text;
      localStorage.setItem('userRole', this.UserRole);
      if (this.UserRole == 'RiderRS') {
        this.router.navigateByUrl('/riderpage');
        this.hs.callToggle.next(this.UserRole);
      } else if (this.UserRole == 'userRS') {
        this.router.navigateByUrl('/userpage');
        this.hs.callToggle.next(this.UserRole);
      } else if (this.UserRole == 'AdimnRS') {
        this.router.navigateByUrl('/adminpage');
        this.hs.callToggle.next(this.UserRole);
      }
    });
  }

  CreateUserInOrg(NewUser: any) {
    debugger;
    const that = this;

    $.cordys.authentication.sso
      .authenticate('sysadmin', 'sys@admin')
      .done((resp: any) => {});

    setTimeout(() => {
      that.CreateUser();
    }, 3000);
  }

  CreateUser() {
    debugger;
    this.hs
      .ajax(
        'CreateUserInOrganization',
        'http://schemas.cordys.com/UserManagement/1.0/Organization',
        {
          User: {
            UserName: this.NewUser.username,
            Description: this.NewUser.username,
            Credentials: {
              UserIDPassword: {
                UserID: this.NewUser.username,
                Password: this.NewUser.password,
              },
            },

            Roles: {
              Role: this.NewUser.role,
            },
          },
        }
      )
      .then((resp) => {
        console.log(resp);
        // alert('User_User');
      });
  }
}
