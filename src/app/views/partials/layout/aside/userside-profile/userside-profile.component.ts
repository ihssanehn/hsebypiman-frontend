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
import Swal from 'sweetalert2';


@Component({
	selector: 'tf-userside-profile',
	templateUrl: './userside-profile.component.html',
  styleUrls: ['./userside-profile.component.scss']
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
		this.user = this.user$

		if(!this.cdr['destroyed']){ 
			this.cdr.detectChanges();
		}
	}

	goToProfileDetail(){
		this.router.navigateByUrl('profile/detail');
	}
	goToEdit(){
		this.router.navigateByUrl('profile/edit');
	}
	/**
	 * Log out
	 */
	logout() {
		this.authService.logout().toPromise();
		
		Swal.fire({
			icon: 'success', 
            title:"Vous avez bien été déconnecté", 
            showConfirmButton: false, 
            timer: 1500 
		}).then(()=>{
			localStorage.removeItem(environment.authTokenKey);
			this.router.navigate(['/auth/login']);
		})
	}
}
