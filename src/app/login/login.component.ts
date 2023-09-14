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
        localStorage.setItem('UserName', this.data.user);
        this.GetUserDetails();
      });
  }

  UserData: any;
  UserRole: any ;
  GetUserDetails() {
    this.service.GetUserDetails({ UserName: this.data.user }).then((resp) => {
      console.log(resp);
      this.UserData = this.hs.xmltojson(resp, 'Roles');
      debugger;
      //this.UserRole = this.UserData[0].Role[5].text;
      //this.UserRole = this.UserData[0].Role[0].text;
      localStorage.setItem('userRole', this.UserRole);

     for (let index = 0; index < this.UserData[0].Role.length; index++) {
      if (this.UserData[0].Role[index].text == 'RiderRS') {
        this.UserRole = this.UserData[0].Role[index].text
        localStorage.setItem('userRole', this.UserRole);

        this.router.navigateByUrl('/riderpage');
        this.hs.callToggle.next(this.UserRole);
        

        this.hs.toast({
          title: 'Success!',
          text: 'Log In successfully',
          icon: 'success',
          toast: true,
          position: 'top-end',
          timer: 2000,
          showConfirmButton: false,
        });
      } else if (this.UserData[0].Role[index].text == 'userRS') {

        this.UserRole = this.UserData[0].Role[index].text
        localStorage.setItem('userRole', this.UserRole);

        this.router.navigateByUrl('/userpage')
        this.hs.callToggle.next(this.UserRole);
        this.hs.toast({
          title: 'Success!',
          text: 'Log In successfully',
          icon: 'success',
          toast: true,
          position: 'top-end',
          timer: 2000,
          showConfirmButton: false,
        });
      } else if (this.UserData[0].Role[index].text == 'AdimnRS') {

        this.UserRole = this.UserData[0].Role[index].text
        localStorage.setItem('userRole', this.UserRole);

        this.router.navigateByUrl('/adminpage');
        this.hs.callToggle.next(this.UserRole);

        this.hs.toast({
          title: 'Success!',
          text: 'Log In successfully',
          icon: 'success',
          toast: true,
          position: 'top-end',
          timer: 2000,
          showConfirmButton: false,
        });
      }
     }
    });
  }

  CreateUserInOrg(NewUser: any) {
    debugger;
    const that = this;

    $.cordys.authentication.sso
      .authenticate('pushpendra', 'pushpendra')
      .done((resp: any) => {});

      //that.CreateUser();

    setTimeout(() => {
      that.CreateUser();
    }, 2000);
  }

  NewRoleUser:any;
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
      .then((resp:any) => {
        console.log(resp);
        this.NewRoleUser = resp.User.Roles.Role
        // alert('User_User');
        setTimeout(() => {
          this.SendMail();
        }, 3000);
      });
  }

  /* Send Mail Service */
  SendMail() {
    var MailBody =
      'Dear ' +
      this.NewUser.username +
      '\nWelcome to RideShare, your trusted partner for convenient and affordable rides! We are excited to have you on board and ready to provide you with the best ride-sharing experience.\n\n' +
      'Name : ' +
      this.NewUser.username +
      ';\n' +
      'Email : ' +
      this.NewUser.email +
      ';\n\n' +
      'To get started with RideShare, log in using your registered User Id and password. With RideShare, you can:\n\n' +
      '- Easily book a ride anytime, anywhere\n' +
      '- Choose from a variety of vehicle options\n' +
      '- Track your ride in real-time\n' +
      '- Pay securely using your preferred payment method\n' +
      '- Rate and review your drivers\n\n' +
      'Thank you for choosing RideShare. We look forward to providing you with a seamless ride-sharing experience. Welcome aboard!\n\n' +
      'Best regards,\n' +
      'Ride Sharing\n';

    debugger;
    this.hs
      .ajax('SendMail', 'http://schemas.cordys.com/1.0/email', {
        to: {
          address: {
            emailAddress: this.NewUser.email,
            displayName: this.NewUser.username,
          },
        },
        // cc: {
        //   address: {
        //     displayName: PARAMETER,
        //     emailAddress: PARAMETER,
        //   }
        // },
        // bcc: {
        //   address: {
        //     displayName: PARAMETER,
        //     emailAddress: PARAMETER,
        //   }
        // },
        subject: 'Welcom to Ride Sharing - Your Signup Confirmation',
        body: MailBody,
        // attachments: {
        //   attachment: PARAMETER,
        // },
        from: {
          displayName: 'Ride Sharing',
          emailAddress: 'pushpendras@adnatesolutions.com',
          replyTo: 'It is a auto generated mail, You can not reply to it.',
        },
        // headers: {
        //   header: PARAMETER,
        // }
      })
      .then((resp) => {
        console.log(resp);
      });
  }
}
