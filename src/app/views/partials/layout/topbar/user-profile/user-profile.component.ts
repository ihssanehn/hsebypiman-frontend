// Angular
import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
// RxJS
import { Observable } from 'rxjs';
// NGRX
import { select, Store } from '@ngrx/store';
// State
import { AppState } from '../../../../../core/reducers';
import { User, AuthService } from '../../../../../core/auth';
import { Router } from '@angular/router';
import { environment } from '@env/environment';


@Component({
	selector: 'tf-user-profile',
	templateUrl: './user-profile.component.html',
})
export class UserProfileComponent implements OnInit {
	// Public properties
	user$: Observable<User>;
	user: User;

	@Input() avatar = true;
	@Input() greeting = true;
	@Input() badge: boolean;
	@Input() icon: boolean;

	/**
	 * Component constructor
	 *
	 * 
	 */
	constructor(
		private authService:AuthService,
		private cdr : ChangeDetectorRef,
		private router: Router,
	) {
	}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	async ngOnInit() {
		// this.user = await this.authService.getUserByToken().toPromise();
		// if(!this.cdr['destroyed']){ 
		// 	this.cdr.detectChanges();
		// }
	}

	viewProfile(){
		// this.router.navigate([`profile/${this.user.id}`]);
	}
	/**
	 * Log out
	 */
	logout() {
		// this.authService.logout().toPromise();
		// localStorage.removeItem(environment.authTokenKey);
		// this.router.navigate(['/auth/login']);
	}
}
