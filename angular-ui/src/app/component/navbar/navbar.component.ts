import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'src/app/services/keycloak/keycloak.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit{
  userHasNoAdminOrOwnerRole: boolean = false;
  router: any;
  constructor(
    private keyCloakService:KeycloakService
  ){}
  ngOnInit(): void {
     const roles = this.keyCloakService.profile?.roles || [];
      this.userHasNoAdminOrOwnerRole =!roles.includes("admin") && !roles.includes("restaurantAdmin");
  }

  onLogoutClick(){
    this.keyCloakService.logout();
  }

  goToProfile(){
    this.router.navigate(['/profile']);
  }
}
