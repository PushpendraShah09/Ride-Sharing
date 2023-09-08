import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RiderpageComponent } from './riderpage.component';

const routes: Routes = [{ path: '', component: RiderpageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RiderpageRoutingModule { }
