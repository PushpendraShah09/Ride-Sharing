import { Injectable } from '@angular/core';
import { HeroService } from './hero.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CordysServiceService {
  constructor(private hs: HeroService) {}

  GetUserDetails = (params: any) =>
    this.hs.ajax(
      'GetUserDetails',
      'http://schemas.cordys.com/UserManagement/1.0/Organization',
      params
    );

Best_and_worst_rated_drivers_in_each_city_with_details = (params: any) =>
    this.hs.ajax(
      'Best_and_worst_rated_drivers_in_each_city_with_details',
      'http://schemas.cordys.com/WSAppServerPackageRS',
      params
    );


GetRiderHistory = (params: any) =>
    this.hs.ajax(
      'GetRiderHistory',
      'http://schemas.cordys.com/WSAppServerPackageRS',
      params
    );

GetUserHistory  = (params: any) =>
    this.hs.ajax(
      'GetUserHistory ',
      'http://schemas.cordys.com/WSAppServerPackageRS',
      params
    );


    private isDropdownOpenSubject = new BehaviorSubject<boolean>(false);
    isDropdownOpen$ = this.isDropdownOpenSubject.asObservable();

    toggleDropdown(): void {
      this.isDropdownOpenSubject.next(!this.isDropdownOpenSubject.value);
    }
}
