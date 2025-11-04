import { inject, Injectable } from '@angular/core';
 import Keycloak from 'keycloak-js';
  import { UserProfile } from './user-profile';
import { Router } from '@angular/router';
  
  @Injectable({ providedIn: 'root' })
   export class KeycloakService {
     private _keycloak: Keycloak | undefined;
      private _profile: UserProfile | undefined;
       private router = inject(Router);
 get keycloak():
      
      Keycloak { 
        if(!this._keycloak){
           this._keycloak = new Keycloak({
           url:'https://lucina-headed-manifoldly.ngrok-free.dev',
            realm:'restaurant-review',
             clientId:'reactNative-app' })
             }
              return this._keycloak;
         }


      get profile(): UserProfile | undefined { return this._profile; }


    getRefreshToken(): string {
      return this.keycloak.refreshToken!;
    }


      async refreshTokenIfNeeded(): Promise<string> {
    if (this.keycloak.isTokenExpired(30)) {
      try {
        await this.keycloak.updateToken();
      } catch (err) {
        this.logout();
        throw err;
      }
    }
    return this.keycloak.token!;
  }

  logout() {
    this.keycloak.logout();
  }
  
    constructor() { }
    
    async init(){
      if (this._keycloak && this._keycloak.authenticated) {
        console.log(' Keycloak already initialized.');
        return true;
      }
       const authenticated = await this.keycloak?.init({ onLoad:'login-required' });
       
       if(authenticated){
         const token = this._keycloak?.token;
         if (token) {
            this.decodeAndSetProfile(token);

            const roles = this._profile?.roles || [];
        if (roles.includes('admin')) {
          this.router.navigate(['/admin-dashboard']);
        } else if(roles.includes('restaurantAdmin')){
          this.router.navigate(['/restaurantOwner-dashboard']);
        }else {
          this.router.navigate(['/user-dashboard']);
        }
          }
          console.log('User authenticated...');
         return true;
         } else{
           console.log("Not authenticated");
            return false; 
          }
         }

         private decodeAndSetProfile(token: string) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));

      this._profile = {
        username: payload.preferred_username,
        email: payload.email,
        firstName: payload.given_name,
        lastName: payload.family_name,
        roles: payload.realm_access?.roles || [],
        token: token
      };

      console.log('Decoded user profile:', this._profile);
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }
}