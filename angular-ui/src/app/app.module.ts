import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {MatToolbarModule} from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

// import { CodeInputModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule, } from '@angular/forms';
import { KeycloakService } from './services/keycloak/keycloak.service';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard/admin-dashboard.component';
import { UserDashboardComponent } from './pages/user/user-dashboard/user-dashboard.component';
import { RestaurantOwnerDashboardComponent } from './pages/restaurantOwner/restaurant-owner-dashboard/restaurant-owner-dashboard.component';
import { SidebarComponent } from './pages/restaurantOwner/sidebar/sidebar.component';
import { HomeComponent } from './pages/restaurantOwner/home/home.component';
import { ProfileComponent } from './pages/restaurantOwner/profile/profile.component';
import { NavbarComponent } from './component/navbar/navbar.component';
import { AddEditRestaurantComponent } from './pages/restaurantOwner/add-edit-restaurant/add-edit-restaurant.component';
import { ReviewComponent } from './pages/restaurantOwner/review/review.component';
import { ResturantComponent } from './pages/restaurantOwner/resturant/resturant.component';
import { RestaurantCardComponent } from './component/restaurant-card/restaurant-card.component';
import { HttpTokenInterceptor } from '../app/services/interceptor/http-token.interceptor';
import { UserProfileComponent } from './pages/user/user-profile/user-profile.component';
import { ProfileCardComponent } from './component/profile-card/profile-card.component';
import { UserRestaurantCardComponent } from './component/user-restaurant-card/user-restaurant-card.component';


export function kcFactory(kcFactory: KeycloakService){
  return () => kcFactory.init();
}
@NgModule({
  declarations: [
    AppComponent,
    AdminDashboardComponent,
    UserDashboardComponent,
    RestaurantOwnerDashboardComponent,
    SidebarComponent,
    HomeComponent,
    ProfileComponent,
    NavbarComponent,
    AddEditRestaurantComponent,
    ReviewComponent,
    ResturantComponent,
    RestaurantCardComponent,
    UserProfileComponent,
    ProfileCardComponent,
    UserRestaurantCardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatToolbarModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-right',
      timeOut: 1000,
      preventDuplicates: true,
    })
    // CodeInputModule
  ],
  providers: [
    HttpClient,
    {
      provide: APP_INITIALIZER,
      deps:[KeycloakService],
      useFactory:kcFactory,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpTokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
