// Angular
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
// RxJS
import { Observable, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';
// NGRX
import { select, Store } from '@ngrx/store';
// Module reducers and selectors
import { AppState} from '../../core/reducers/';
// import { currentUserPermissions } from '../_selectors/auth.selectors';
import { ModuleService } from '../services/module.service';
import { find } from 'lodash';

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
        
        return this.moduleService.populate(moduleCodes);
    }
}
