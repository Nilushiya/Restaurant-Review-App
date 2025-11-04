import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ResturantService } from '../../../services/restaurant/resturant.service';
import { PhotoService } from '../../../services/photo/photo.service';

@Component({
  selector: 'app-add-edit-restaurant',
  templateUrl: './add-edit-restaurant.component.html',
  styleUrls: ['./add-edit-restaurant.component.scss']
})
export class AddEditRestaurantComponent implements OnInit {

  isEditMode = false;
  previews: { localUri: string; uploadedUrl: string }[] = [];
  restaurantId: string | null = null;

  form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    cuisineType: ['', Validators.required],
    contactInformation: ['', Validators.required],
    address: this.fb.group({
      streetNumber: ['', Validators.required],
      streetName: ['', Validators.required],
      unit: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      postalCode: ['', Validators.required],
      country: ['', Validators.required],
    }),
    operatingHours: this.fb.group({
      monday: this.fb.group({ openTime: [''], closeTime: [''] }),
      tuesday: this.fb.group({ openTime: [''], closeTime: [''] }),
      wednesday: this.fb.group({ openTime: [''], closeTime: [''] }),
      thursday: this.fb.group({ openTime: [''], closeTime: [''] }),
      friday: this.fb.group({ openTime: [''], closeTime: [''] }),
      saturday: this.fb.group({ openTime: [''], closeTime: [''] }),
      sunday: this.fb.group({ openTime: [''], closeTime: [''] }),
    }),
    photoIds: [[]]
  });
  toastr: any;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private restaurantService: ResturantService,
    private photoService: PhotoService,
  ) {}

  ngOnInit() {
    const data = history.state['restaurant'];
    if (data) {
      this.isEditMode = true;
      this.restaurantId = data.id;

      this.form.patchValue(data);

      if (data.photos?.length) {
        this.previews = data.photos.map((p: any) => ({
          localUri: p.url,
          uploadedUrl: p.url
        }));
      }
    }
  }

  uploadImages(event: any) {
    const files: File[] = Array.from(event.target.files);

    this.photoService.uploadPhotos(files).subscribe({
      next: (uploaded) => {
        const uploadedUrls = uploaded.map((p: any) => p.url);
        const combined = uploaded.map((p: any, i: number) => ({
          localUri: URL.createObjectURL(files[i]),
          uploadedUrl: p.url
        }));

        this.previews.push(...combined);

        this.form.patchValue({
          photoIds: [...this.form.value.photoIds, ...uploadedUrls]
        });

      },
      error: () => this.toastr.error('Photo upload failed') 
    });
  }

  removePhoto(index: number, url: string) {
    this.photoService.deletePhoto(url).subscribe();

    this.previews.splice(index, 1);

    const updated = this.form.value.photoIds.filter((p: string) => p !== url);
    this.form.patchValue({ photoIds: updated });
  }

  submit() {
    if (this.form.invalid) {
      this.toastr.error('Please fill all required fields')
      return;
    }

    if (this.isEditMode) {
      this.restaurantService.updateRestaurant(this.restaurantId!, this.form.value)
        .subscribe(() => {
          this.toastr.success('Restaurant updated successfully')
          this.router.navigate(['/restaurants']);
        });
    } else {
      this.restaurantService.createRestaurantsByOwner(this.form.value)
        .subscribe(() => {
          this.toastr.success('Restaurant added successfully')
          this.router.navigate(['/restaurants']);
        });
    }
  }
}
