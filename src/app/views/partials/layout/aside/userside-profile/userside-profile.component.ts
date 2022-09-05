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
import { NgxPermissionsService, NgxRolesService } from 'ngx-permissions';
import { DocumentService } from '@app/core/services';

	


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
		private ngxRolesService: NgxRolesService,
		private documentService: DocumentService,

	) {
		this.authService.getCurrentUser().subscribe(x=> {
			if(x.photo_profil_id)(
				x.photo_profil = {
					id: x.photo_profil_id,
					src: this.documentService.readFile(x.photo_profil_id)
				} 
			)
			this.user = x;
		});
		this.ngxRolesService.roles$.subscribe((event) => {this.cdr.markForCheck();});
	}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	async ngOnInit() {

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
	goToParams(){
		this.router.navigateByUrl('/admin');
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
			localStorage.removeItem(environment.entity);
			this.router.navigate(['/auth/login']);
		})
	}

	hasPermission(test){

		return test.filter(permission =>  this.ngxRolesService.getRole(permission)).length > 0;
		
	}
	
}