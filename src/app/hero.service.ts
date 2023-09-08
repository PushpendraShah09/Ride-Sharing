import { Injectable } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BehaviorSubject, Subject } from 'rxjs';
declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  callToggle = new Subject();
  role!: BehaviorSubject<any>;
  constructor(private loader: NgxUiLoaderService) { }

  nextCount(role: any) {
    this.role.next(role);
  }

  xmltojson(resp: any, tag: any) {
    return $.cordys.json.findObjects(resp, tag);
  }

  ajax(method: any, namespace: any, parameters: any) {
    return new Promise((rev, rej) => {
      const that = this;
      that.loader.start();

      $.cordys.ajax({
        method: method,
        namespace: namespace,
        dataType: '* json',
        parameters: parameters,
        success: function success(resp: any) {
          that.loader.stop();

          rev(resp);
        },

        error: function error(e1: any, e2: any, e3: any) {
          rej([e1, e2, e3]);
        },
      });
    });
  }

}
