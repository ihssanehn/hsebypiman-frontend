// Angular
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

// Auth reducers and selectors
import { AuthService } from '../_services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private router: Router,
        private authService : AuthService) { }


    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.authService.populate();
        
    }
}
