import { Component, OnInit } from '@angular/core';
import { KeycloakService } from './services/keycloak/keycloak.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  constructor(
    private keyCloakService: KeycloakService
  ){}

  async ngOnInit(): Promise<void> {
      await this.keyCloakService.init();
  }
}
