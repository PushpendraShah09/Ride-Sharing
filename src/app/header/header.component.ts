import { Component, OnInit } from '@angular/core';
import { HeroService } from '../hero.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {


  constructor(public hs: HeroService, public router: Router) {
    debugger;

  }
  userRole: any = null;

  ngOnInit(): void {
    debugger;

    this.hs.callToggle.subscribe((role) => {
      console.log(role);
      this.userRole = role;

      debugger;
    })
    // this.userRole = localStorage.getItem('userRole');


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

  Logout() {
    // localStorage.removeItem('userRole');
    // localStorage.clear();
    debugger;
    this.userRole = null;
    var c_a = document.cookie.split(';').map((cookie) => cookie.split('='));
    var c = 0;
    while (c < c_a.length) {
      var c_a_name = c_a[c][0];
      document.cookie =
        c_a_name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
      c++;
    }

    this.router.navigateByUrl('/login');
  }
}
