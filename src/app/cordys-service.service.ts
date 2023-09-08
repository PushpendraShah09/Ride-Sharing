import { Injectable } from '@angular/core';
import { HeroService } from './hero.service';

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
}
