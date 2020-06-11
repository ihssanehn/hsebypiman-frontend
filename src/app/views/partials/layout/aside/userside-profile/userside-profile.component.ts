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
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';


@Component({
	selector: 'tf-userside-profile',
	templateUrl: './userside-profile.component.html',
})
export class UserSideProfileComponent implements OnInit {
	// Public properties
	user$: User;
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
		this.authService.currentUser.subscribe(x=> this.user$ = x);
	}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	async ngOnInit() {
		console.log(this.user$)
		var res = await this.authService.getUserByToken().toPromise();
		this.user = res.result.data;
		this.cdr.detectChanges();
	}

	viewProfile(){
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
