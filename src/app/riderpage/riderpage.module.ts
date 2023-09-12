import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RiderpageRoutingModule } from './riderpage-routing.module';
import { RiderpageComponent } from './riderpage.component';


@NgModule({
  declarations: [
    RiderpageComponent
  ],
  imports: [
    CommonModule,
    RiderpageRoutingModule,
    FormsModule,
  ]
})
export class RiderpageModule { }
