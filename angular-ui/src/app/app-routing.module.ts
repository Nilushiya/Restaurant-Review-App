import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard/admin-dashboard.component';
import { UserDashboardComponent } from './pages/user/user-dashboard/user-dashboard.component';
import { RestaurantOwnerDashboardComponent } from './pages/restaurantOwner/restaurant-owner-dashboard/restaurant-owner-dashboard.component';
import { HomeComponent } from './pages/restaurantOwner/home/home.component';
import { ProfileComponent } from './pages/restaurantOwner/profile/profile.component';
import { AddEditRestaurantComponent } from './pages/restaurantOwner/add-edit-restaurant/add-edit-restaurant.component';
import { ReviewComponent } from './pages/restaurantOwner/review/review.component';
import { ResturantComponent } from './pages/restaurantOwner/resturant/resturant.component';
import { RestaurantDetailsComponent } from './pages/user/restaurant-details/restaurant-details.component';

const routes: Routes = [
  {
    path:'admin-dashboard',
    component:AdminDashboardComponent,
    pathMatch:'full'
  },
  {
    path:'restaurantOwner-dashboard',
    component:RestaurantOwnerDashboardComponent,
    children:[
      {
        path:'',
        component:HomeComponent,
      },
      {
        path:'profile',
        component:ProfileComponent,
      },
      {
        path:'restaurant',
        component:ResturantComponent,
      },
      {
        path:'add/edit',
        component:AddEditRestaurantComponent,
      },
      {
        path:'review',
        component:ReviewComponent,
      },
    ]
  },
  {
    path:'user-dashboard',
    component:UserDashboardComponent,
    pathMatch:'full'
  },
  {
    path:'restaurant-details/:id',
    component:RestaurantDetailsComponent,
    pathMatch:'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
