import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminpageRoutingModule } from './adminpage-routing.module';
import { AdminpageComponent } from './adminpage.component';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [
    AdminpageComponent
  ],
  imports: [
    CommonModule,
    AdminpageRoutingModule,
  ]
})
export class AdminpageModule { }
