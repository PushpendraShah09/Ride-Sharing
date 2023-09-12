import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AdminpageRoutingModule } from './adminpage-routing.module';
import { AdminpageComponent } from './adminpage.component';
import { DataTablesModule } from 'angular-datatables';
import { NgxPaginationModule } from 'ngx-pagination';
import { CustomDatePipe } from '../custom-date.pipe';

@NgModule({
  declarations: [AdminpageComponent, CustomDatePipe],
  imports: [
    CommonModule,
    FormsModule,
    AdminpageRoutingModule,
    DataTablesModule,
    NgxPaginationModule,
  ],
  exports: [AdminpageComponent],
})
export class AdminpageModule {}
