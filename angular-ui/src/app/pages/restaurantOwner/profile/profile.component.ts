import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { KeycloakService } from 'src/app/services/keycloak/keycloak.service';
import { UserProfile } from 'src/app/services/keycloak/user-profile';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit{
  userProfile!: UserProfile | undefined;
  profileForm!: FormGroup;
  isEditing = false;

  constructor(
    private keyCloakService:KeycloakService,
    private fb: FormBuilder,
  ){}

  ngOnInit(): void {
    this.userProfile = this.keyCloakService.profile;
    console.log("user:",this.userProfile);
    console.log("user keycloak:",this.keyCloakService.profile);

    this.profileForm = this.fb.group({
      username: [this.userProfile?.username],
      email: [this.userProfile?.email],
      firstName: [this.userProfile?.firstName],
      lastName: [this.userProfile?.lastName],
      roles: [{ value: this.userProfile?.roles?.join(', '), disabled: true }]
    });

    this.profileForm.disable();
  }

  
  enableEdit() {
    this.isEditing = true;
    this.profileForm.enable();
    this.profileForm.get('roles')?.disable();

    this.profileForm.enable();
  }

  saveChanges() {
    if (this.profileForm.valid) {
      this.userProfile = { ...this.userProfile, ...this.profileForm.value };
      this.isEditing = false;
      this.profileForm.disable();

      console.log('Updated user details:', this.userProfile);

      // (Optional) — send to backend if you have user update API
      // this.userService.updateUser(this.userProfile).subscribe(...)
    }
    this.profileForm.disable();
  }

}
