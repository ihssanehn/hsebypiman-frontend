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
	selector: 'tf-userside-profile',
	templateUrl: './userside-profile.component.html',
})
export class UserSideProfileComponent implements OnInit {
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
		var res = await this.authService.getUserByToken().toPromise();
		this.user = res.result.data;
		this.cdr.detectChanges();
	}

	viewProfile(){
		console.log(this.user);
		this.router.navigate([`profile/${this.user.id}`]);
	}
	/**
	 * Log out
	 */
	logout() {
		this.authService.logout().toPromise();
		localStorage.removeItem(environment.authTokenKey);
		this.router.navigate(['/auth/login']);
	}
}
