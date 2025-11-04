import { inject } from "@angular/core";
import { CanActivateChildFn, Router } from "@angular/router";
import { KeycloakService } from "../keycloak/keycloak.service";

export const authGuard: CanActivateChildFn = () => {
    const keycloakService = inject<KeycloakService>(KeycloakService);
    const router = inject(Router);
    if (keycloakService.keycloak?.isTokenExpired()) {
        router.navigate(['login']);
        return false;
    }
    return true;
}
