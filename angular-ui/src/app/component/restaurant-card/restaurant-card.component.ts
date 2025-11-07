import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { KeycloakService } from 'src/app/services/keycloak/keycloak.service';
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
export class RestaurantCardComponent implements OnChanges {
  @Input() restaurant!: Restaurant;
  @Output() delete = new EventEmitter<string>();
  @Output() edit = new EventEmitter<string>();

  userHasAdminOrOwnerRole: boolean = false;
  constructor(
    private photoService: PhotoService,
    private keyCloakService: KeycloakService,
  ){}
  
  imageUrl: string = '';

ngOnChanges(changes: SimpleChanges): void {
  if (changes['restaurant'] && this.restaurant) {
    console.log("Restaurant received:", this.restaurant);

    if (this.restaurant?.photos?.length > 0) {
      this.imageUrl = this.photoService.getPhoto(this.restaurant.photos[0].url);
      console.log("Image URL:", this.imageUrl);
    }
  }
  const roles = this.keyCloakService.profile?.roles || [];
    this.userHasAdminOrOwnerRole =roles.includes("admin") || roles.includes("restaurantAdmin");
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
