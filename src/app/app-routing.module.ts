import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UserpageComponent } from './userpage/userpage.component';
import { RiderpageComponent } from './riderpage/riderpage.component';
import { AdminpageComponent } from './adminpage/adminpage.component';
import { HistoryComponent } from './history/history.component';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'userpage', component: UserpageComponent },
  { path: 'riderpage', component: RiderpageComponent },
  { path: 'adminpage', component: AdminpageComponent },
  { path: 'myhistory', component: HistoryComponent },
  // { path: 'riderpage', loadChildren: () => import('./riderpage/riderpage.module').then(m => m.RiderpageModule) },
  // {
  //   path: 'adminpage',
  //   loadChildren: () =>
  //     import('./adminpage/adminpage.module').then((m) => m.AdminpageModule),
  // },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
