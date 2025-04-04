import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLoggedIn()) {
    // Si no está logueado → al login
    return router.createUrlTree(['/']);
  }

  const userRoles = auth.getUserRoles();
  const allowedRoles = route.data['roles'] as string[];

  const hasAccess = userRoles.some((role) => allowedRoles.includes(role));

  // Si el rol no coincide, redirige al login o a página de acceso denegado
  return hasAccess ? true : router.createUrlTree(['/access-denied']);
};
