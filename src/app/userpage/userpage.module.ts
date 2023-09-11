import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserpageRoutingModule } from './userpage-routing.module';
import { UserpageComponent } from './userpage.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import * as Leaflet from 'leaflet'
import "leaflet-control-geocoder"
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    UserpageComponent
  ],
  imports: [
    CommonModule,
    UserpageRoutingModule,
    LeafletModule,
    FormsModule,NgSelectModule
  ],
  exports: [
    UserpageComponent
  ]
})
export class UserpageModule { }
