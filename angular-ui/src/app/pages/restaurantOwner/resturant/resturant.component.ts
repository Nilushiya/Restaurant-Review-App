import { Component, OnInit } from '@angular/core';
import { ResturantService } from 'src/app/services/restaurant/resturant.service'; 
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-resturant',
  templateUrl: './resturant.component.html',
  styleUrls: ['./resturant.component.scss']
})
export class ResturantComponent implements OnInit{
  restaurants:any[] = [];
  loading = true;

  constructor(
    private restaurantService: ResturantService,
    private toastr: ToastrService
  ){}

  ngOnInit(): void {
    this.fetchRestaurants();
  }

  fetchRestaurants() {
  this.loading = true;

  this.restaurantService.getRestaurantsByOwner().subscribe({
    next: (response: any) => {
      if (response.status === 204) {
        console.log("No content returned");
        this.restaurants = [];
      }

      else if (response.status === 200) {
        this.restaurants = response.body || [];
        console.log("Fetched restaurants:", this.restaurants);
      }

      this.loading = false;
    },

    error: (err) => {
      this.toastr.error('Something went wrong!')
      this.restaurants = [];
      this.loading = false;
    }
  });
}

 onDelete(id: string) {
    this.restaurantService.deleteRestaurant(id).subscribe({
      next: (response:any) => {
        if(response.status == 204){
            this.toastr.success('Success: Restaurant deleted')
          }
        this.fetchRestaurants(); 
      },
      error: () => this.toastr.error('Something went wrong!')
    });
  }

}
