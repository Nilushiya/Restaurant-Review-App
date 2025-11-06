import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PhotoService } from 'src/app/services/photo/photo.service';

@Component({
  selector: 'app-user-restaurant-card',
  templateUrl: './user-restaurant-card.component.html',
  styleUrls: ['./user-restaurant-card.component.scss']
})
export class UserRestaurantCardComponent implements OnInit{
 @Input() restaurant: any;

  constructor(
    private photoService: PhotoService,
    private route: ActivatedRoute
  ){}
  
  imageUrl: string = '';

 ngOnInit(): void {
  const id = this.route.snapshot.paramMap.get('id');
    if (this.restaurant?.photos?.length > 0) {
      this.imageUrl = this.photoService.getPhoto(this.restaurant.photos[0].url);
    }
 }

}
