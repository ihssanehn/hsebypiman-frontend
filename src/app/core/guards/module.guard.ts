// Angular
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
// RxJS
import { Observable, of } from 'rxjs';
// NGRX
import { Store } from '@ngrx/store';
// Module reducers and selectors
import { AppState} from '../../core/reducers/';
// import { currentUserPermissions } from '../_selectors/auth.selectors';
import { ModuleService } from '../services/module.service';

@Injectable()
export class ModuleGuard implements CanActivate {

    constructor(
        private store: Store<AppState>, 
        private router: Router, 
        private moduleService:ModuleService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

        const moduleCodes = route.data.moduleCodes as string;
        if (!moduleCodes) {
            return of(false);
        }
        
        var test = this.moduleService.populate(moduleCodes);
        if(test){
            return true
        }else{
            this.router.navigateByUrl('/')
        }
    }
}
