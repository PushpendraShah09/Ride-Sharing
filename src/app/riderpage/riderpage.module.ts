import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RiderpageRoutingModule } from './riderpage-routing.module';
import { RiderpageComponent } from './riderpage.component';


@NgModule({
  declarations: [
    RiderpageComponent
  ],
  imports: [
    CommonModule,
    RiderpageRoutingModule
  ]
})
export class RiderpageModule { }
