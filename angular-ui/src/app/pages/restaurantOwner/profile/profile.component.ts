// profile.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { KeycloakService } from 'src/app/services/keycloak/keycloak.service';
import { UserProfile } from 'src/app/services/keycloak/user-profile';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  userProfile!: UserProfile | undefined;
  profileForm!: FormGroup;
  isEditing = false;

  constructor(
    private keyCloakService: KeycloakService,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.userProfile = this.keyCloakService.profile;

    this.profileForm = this.fb.group({
      username: [this.userProfile?.username],
      email: [this.userProfile?.email],
      firstName: [this.userProfile?.firstName],
      lastName: [this.userProfile?.lastName],
      roles: [{ value: this.userProfile?.roles?.join(', '), disabled: true }]
    });

    this.profileForm.disable();   // initial disable
  }

  enableEdit() {
    this.isEditing = true;
    this.profileForm.enable();
    this.profileForm.get('roles')?.disable(); // keep roles read-only
  }

  saveChanges() {
    if (this.profileForm.valid) {
      this.userProfile = { ...this.userProfile, ...this.profileForm.value };
      console.log("Updated user:", this.userProfile);

      // disable again after save
      this.profileForm.disable();
      this.isEditing = false;

      // API call if needed
      // this.userService.updateUser(this.userProfile).subscribe(...)
    }
  }
}
