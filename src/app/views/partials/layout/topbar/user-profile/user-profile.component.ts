// Angular
import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
// RxJS
import { Observable } from 'rxjs';
import { User, AuthService } from '../../../../../core/auth';
import { Router } from '@angular/router';


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
		// localStorage.removeItem(environment.entity);
		// this.router.navigate(['/auth/login']);
	}
}
