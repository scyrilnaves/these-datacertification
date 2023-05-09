import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InputFormMainComponent } from './input-form-main/input-form-main.component';
import { InputDisplayMainComponent } from './input-display-main/input-display-main.component';
import {Routes,RouterModule} from "@angular/router";
import { TripDisplayComponent } from './trip-display/trip-display.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AdminComponent } from './admin/admin.component';
import { UserComponent } from './user/user.component';
import { CommonComponent } from './common/common.component';


const routes: Routes = [
  {
  path: '',
  component: InputFormMainComponent
  },
  {
  path: 'route',
  component: InputDisplayMainComponent
  },
  {
    path: 'trip',
    component: TripDisplayComponent
  },
  {
    path: 'admin',
    component: AdminComponent
  },
  {
    path: 'user',
    component: UserComponent
  },
  {
    path: 'common',
    component: CommonComponent
  }
]

@NgModule({
  declarations: [
    AppComponent,
    InputFormMainComponent,
    InputDisplayMainComponent,
    TripDisplayComponent,
    HomeComponent,
    NavbarComponent,
    AdminComponent,
    UserComponent,
    CommonComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    NgbModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
