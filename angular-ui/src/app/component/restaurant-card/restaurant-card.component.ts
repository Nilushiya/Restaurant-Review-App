import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { PhotoService } from 'src/app/services/photo/photo.service';

interface OperatingDay {
  openTime: string;
  closeTime: string;
}

interface Restaurant {
  id: string;
  name: string;
  cuisineType: string;
  contactInformation: string;
  averageRating: number;
  geoLocation: {
    latitude: number;
    longitude: number;
  };
  address: {
    streetNumber: string;
    streetName: string;
    unit: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  operatingHours: Record<string, OperatingDay>;
  photos: { url: string; uploadDate: string }[];
  createdBy: {
    id: string;
    username: string;
    givenName: string;
    familyName: string;
  };
  totalReviews: number;
}

@Component({
  selector: 'app-restaurant-card',
  templateUrl: './restaurant-card.component.html',
  styleUrls: ['./restaurant-card.component.scss']
})
export class RestaurantCardComponent implements OnInit {
  @Input() restaurant!: Restaurant;
  @Output() delete = new EventEmitter<string>();
  @Output() edit = new EventEmitter<string>();

  constructor(
    private photoService: PhotoService
  ){}
  
  imageUrl: string = '';

  ngOnInit(): void {
    if (this.restaurant?.photos?.length > 0) {
      this.imageUrl = this.photoService.getPhoto(this.restaurant.photos[0].url);
    }
  }

  onDelete() {
    console.log("id:",this.restaurant.id);
    this.delete.emit(this.restaurant.id);
  }

  onEdit() {
    // route to edit page
    console.log("Edit", this.restaurant);
  }

}
