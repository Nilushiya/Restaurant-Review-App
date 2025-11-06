import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResturantService } from 'src/app/services/restaurant/resturant.service';

@Component({
  selector: 'app-restaurant-details',
  templateUrl: './restaurant-details.component.html',
  styleUrls: ['./restaurant-details.component.scss']
})
export class RestaurantDetailsComponent implements OnInit{
  restaurants: any[] = [];
  full_restaurant: any;
  longitude:any;
  latitude:any;
  loading: boolean = false;
  page: number = 1;
  size: number = 6;
  totalPages: number = 1;
  radius:number =  5;

  constructor(
    private router: Router,
    private restaurantService: ResturantService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    console.log("view");
    this.route.paramMap.subscribe(params => {
    const id = params.get('id');
    if (id) {
      console.log("id have");
      this.getrestaurantByID(id);
    }
  });
  }

  getrestaurantByID(id: string){
    this.restaurantService.getRestaurantsById(id).subscribe({
      next: (res) => {
        console.log("res:",res.body);
        this.full_restaurant = res.body || [];
        this.latitude= this.full_restaurant.geoLocation.latitude;
        this.longitude=this.full_restaurant.geoLocation.longitude;
        console.log("respose restaurant:",this.full_restaurant,this.latitude);
        this.getNearByRestaurants(1);
      },
      error: (err) => console.error('Error:', err),
      complete: () => (this.loading = false),
    });
  }

    getNearByRestaurants(page: number) {
      console.log("near");
    this.loading = true;
console.log("geo:",this.latitude);
    const params: any = {
       page: page,
       size: this.size,
       radius: this.radius,
       latitude: this.latitude,
       longitude: this.longitude,
      };

        this.restaurantService.searchRestaurants(params).subscribe({
      next: (res) => {
        const all_nearbyrestaurants = res.content || [];
        this.restaurants = all_nearbyrestaurants.filter((r: { id: any; }) => r.id !== this.full_restaurant.id);
        this.totalPages = res.totalPages || 1;
        this.page = page;
      },
      error: (err) => console.error('Error:', err),
      complete: () => (this.loading = false),
    });
  }

  // changePage(p: number) {
  //   if (p >= 1 && p <= this.totalPages) {
  //     this.getNearByRestaurants(p);
  //   }
  // }

onHorizontalScroll(div: HTMLElement) {
  const atRightEnd =
    Math.ceil(div.scrollLeft + div.clientWidth) >= div.scrollWidth - 10;

  const atLeftEnd = div.scrollLeft <= 0;

  // Load next page
  if (atRightEnd && !this.loading && this.page < this.totalPages) {
    this.loadMoreNext();
  }

  // Load previous page
  if (atLeftEnd && !this.loading && this.page > 1) {
    this.loadMorePrevious();
  }
}

loadMoreNext() {
  this.getNearByRestaurants(this.page + 1);
}

loadMorePrevious() {
  this.getNearByRestaurants(this.page - 1);
}
}
