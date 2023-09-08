import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserpageRoutingModule } from './userpage-routing.module';
import { UserpageComponent } from './userpage.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import * as Leaflet from 'leaflet'
import "leaflet-control-geocoder"


@NgModule({
  declarations: [
    UserpageComponent
  ],
  imports: [
    CommonModule,
    UserpageRoutingModule,
    LeafletModule
  ],
  exports: [
   UserpageComponent
  ]
})
export class UserpageModule { }
