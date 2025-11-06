import { Component, OnInit } from '@angular/core';
import { ResturantService } from '../../../services/restaurant/resturant.service';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss'],
})
export class UserDashboardComponent implements OnInit {

  restaurants: any[] = [];
  page: number = 1;
  size: number = 6;
  totalPages: number = 1;
  searchQuery: string = '';
  loading: boolean = false;

  constructor(private restaurantService: ResturantService) {}

  ngOnInit(): void {
    this.getRestaurants(1); // First Load (NO SEARCH)
  }

  getRestaurants(page: number) {
    this.loading = true;

    const params: any = { page, size: this.size };

    if (this.searchQuery.trim() !== '') {
      params.q = this.searchQuery;
    }

    this.restaurantService.searchRestaurants(params).subscribe({
      next: (res) => {
        this.restaurants = res.content || [];
        this.totalPages = res.totalPages || 1;
        this.page = page;
      },
      error: (err) => console.error('Error:', err),
      complete: () => (this.loading = false),
    });
  }

  search() {
    if (this.searchQuery.trim() === '') return;
    this.getRestaurants(1);
  }

  reset() {
    this.searchQuery = '';
    this.getRestaurants(1);
  }

  changePage(p: number) {
    if (p >= 1 && p <= this.totalPages) {
      this.getRestaurants(p);
    }
  }
}
