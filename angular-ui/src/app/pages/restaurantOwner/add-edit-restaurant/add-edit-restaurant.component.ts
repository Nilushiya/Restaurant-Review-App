import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ResturantService } from '../../../services/restaurant/resturant.service';
import { PhotoService } from '../../../services/photo/photo.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-edit-restaurant',
  templateUrl: './add-edit-restaurant.component.html',
  styleUrls: ['./add-edit-restaurant.component.scss']
})
export class AddEditRestaurantComponent implements OnInit {

  form!: FormGroup;
  formLoaded = false;

  isEditMode = false;
  previews: { localUri: string; uploadedUrl: string }[] = [];
  restaurantId: string | null = null;
  weekDays = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];
  @ViewChild('fileInput') fileInput: any;
  trackDay(index:number, item:any){
    return item;
  }

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private restaurantService: ResturantService,
    private photoService: PhotoService,
    private toastr: ToastrService,
  ) {}

  ngOnInit() {
    this.createForm();

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

    this.formLoaded = true; 
  }

  createForm() {
    this.form = this.fb.group({
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
      operatingHours: this.fb.group({}),
      photoIds: [ [] , Validators.required],
    });

    this.weekDays.forEach(day => {
    (this.form.get('operatingHours') as FormGroup)
      .addControl(day, this.fb.group({
        openTime: ['', Validators.required],   
        closeTime: ['', Validators.required]     
      }));
  });
  this.formLoaded = true;
  }

  
  uploadImages(event: any) {
    const files: File[] = Array.from(event.target.files);

    this.photoService.uploadPhotos(files).subscribe({
      next: (uploaded) => {
        const combined = uploaded.map((p: any, i: number) => ({
          localUri: URL.createObjectURL(files[i]),
          uploadedUrl: p.url
        }));

        this.previews.push(...combined);

        this.form.patchValue({
          photoIds: [...this.form.value.photoIds, ...uploaded.map((p: any) => p.url)]
        });

      }
    });

    //  if (this.fileInput) {
    //     this.fileInput.nativeElement.value = '';
    //   }
  }

  removePhoto(index: number, url: string) {
    this.photoService.deletePhoto(url).subscribe();
    this.previews.splice(index, 1);

    const updated = this.form.value.photoIds.filter((p: string) => p !== url);
    this.form.patchValue({ photoIds: updated });

    if (this.previews.length === 0 && this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  submit() { 
    if (this.form.invalid) {
      console.log("submit",this.form.invalid);
      this.toastr.error('Please fill all required fields');
      return;
    }

    if (this.isEditMode) {
      this.restaurantService.updateRestaurant(this.restaurantId!, this.form.value)
        .subscribe(() => {
          this.toastr.success('Restaurant updated successfully');
          // this.router.navigate(['/restaurantOwner-dashboard/restaurant']);
          this.form.reset();
          this.previews = [];
          if (this.fileInput) this.fileInput.nativeElement.value = '';
          this.form.markAsPristine();
          this.form.markAsUntouched();
        });
    } else {
      console.log("value:",this.form.value);
      this.restaurantService.createRestaurantsByOwner(this.form.value)
        .subscribe(
          {
      next: (response:any) => {
        console.log("status:",response,response.status);
        if(response.status == 200){
            this.toastr.success('Restaurant added successfully')
          }
        this.form.reset();
          this.previews = [];
          if (this.fileInput) this.fileInput.nativeElement.value = '';
          this.form.markAsPristine();
          this.form.markAsUntouched(); 
      },
      error: () => this.toastr.error('Something went wrong!')
    });
    }
  }
}
