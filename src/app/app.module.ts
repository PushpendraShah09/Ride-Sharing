import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxPaginationModule } from 'ngx-pagination';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './header/header.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { FooterComponent } from './footer/footer.component';
import { LoginComponent } from './login/login.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { UserpageComponent } from './userpage/userpage.component';
import { RiderpageComponent } from './riderpage/riderpage.component';
import { AdminpageComponent } from './adminpage/adminpage.component';
import { LoginModule } from './login/login.module';
import { CommonModule } from '@angular/common';
import { AdminpageModule } from './adminpage/adminpage.module';
import { UserpageModule } from './userpage/userpage.module';
import { RiderpageModule } from './riderpage/riderpage.module';
import { NgxUiLoaderModule, NgxUiLoaderConfig, SPINNER } from 'ngx-ui-loader';
import { HttpClientModule } from '@angular/common/http';
import { HistoryComponent } from './history/history.component';
import { DataTablesModule } from 'angular-datatables';
import { NgSelectModule } from '@ng-select/ng-select';
import { ModalModule } from 'ngx-bootstrap/modal';

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  fgsColor: '#ffffff',
  bgsSize: 40,
  fgsType: SPINNER.chasingDots,
  pbThickness: 5,
};

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidenavComponent,
    FooterComponent,
    HistoryComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    LeafletModule, LoginModule,
    CommonModule,
    AdminpageModule,
    LoginModule,
    RiderpageModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    AdminpageModule,
    HttpClientModule,
    DataTablesModule,
    NgSelectModule,
    ModalModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
