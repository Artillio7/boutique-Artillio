import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    // Vérifie d'abord si l'utilisateur est connecté
    if (!this.authService.isLoggedIn()) {
      return this.router.createUrlTree(['/login']);
    }

    // Récupère les rôles requis depuis les données de la route
    const requiredRoles = route.data['roles'] as string[] | undefined;

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // Vérifie si l'utilisateur a au moins un des rôles requis
    if (this.authService.hasAnyRole(requiredRoles)) {
      return true;
    }

    // Accès refusé - redirige vers la liste des commandes avec un message
    return this.router.createUrlTree(['/commandes'], {
      queryParams: { error: 'access_denied' }
    });
  }
}
