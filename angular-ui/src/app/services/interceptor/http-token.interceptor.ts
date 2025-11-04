import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import { from, Observable, switchMap } from 'rxjs';
import { KeycloakService} from '../keycloak/keycloak.service'

@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {

  constructor(private keyCloakService: KeycloakService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.keyCloakService.refreshTokenIfNeeded()).pipe(
      switchMap((token: string) => {
        const clonedReq = req.clone({
          setHeaders: { Authorization: `Bearer ${token}` }
        });
        return next.handle(clonedReq);
      })
    );
  }
}
