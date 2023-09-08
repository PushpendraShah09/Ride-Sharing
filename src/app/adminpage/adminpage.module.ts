import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminpageRoutingModule } from './adminpage-routing.module';
import { AdminpageComponent } from './adminpage.component';


@NgModule({
  declarations: [
    AdminpageComponent
  ],
  imports: [
    CommonModule,
    AdminpageRoutingModule
  ]
})
export class AdminpageModule { }
