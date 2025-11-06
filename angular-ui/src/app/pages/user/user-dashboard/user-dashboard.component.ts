import { Component, OnInit } from '@angular/core';
import { ResturantService } from 'src/app/services/restaurant/resturant.service';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss']
})
export class UserDashboardComponent implements OnInit{
  restaurants: any[] = [];
  searchQuery = '';
  loading = false;

  page = 0;
  size = 6;
  totalElements = 0;

  constructor(private restaurantService: ResturantService) {}

  ngOnInit() {
    this.fetchRestaurants();
  }

  fetchRestaurants() {
    this.loading = true;

    this.restaurantService.searchRestaurants({
      q: this.searchQuery,
      page: this.page,
      size: this.size
    }).subscribe({
      next: (res:any) => {
        console.log("res:",res);
        this.restaurants = res.content;
        this.totalElements = res.totalElements;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  onSearchClick() {
    this.page = 0; 
    this.fetchRestaurants();
  }

  pageChange(page: number) {
    this.page = page;
    this.fetchRestaurants();
  }
}