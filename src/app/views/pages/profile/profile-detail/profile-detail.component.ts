import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from "rxjs";
import { User as User, AuthService } from '@app/core/auth';
import { UserService, DocumentService } from '@app/core/services';
import { map } from 'rxjs/operators';

@Component({
  selector: 'tf-profile-detail',
  templateUrl: './profile-detail.component.html',
  styleUrls: ['./profile-detail.component.scss']
})
export class ProfileDetailComponent implements OnInit, OnDestroy {
  
	// Private properties
	private subscriptions: Subscription[] = [];
	user$: User;
	user: User;

	/**
	 * Component constructor
	 *
	 * @param activatedRoute: ActivatedRoute
	 * @param router: Router
	 * @param actionFB: FormBuilder
	 * @param layoutUtilsService: LayoutUtilsService
	 */
	constructor(
		private router: Router,
		private authService: AuthService,
		private userService: UserService,
		private documentService: DocumentService,
		private cdr: ChangeDetectorRef,
	) {
		this.authService.currentUser.subscribe(x=> this.user$ = x);
	}

	ngOnInit() {
		this.getUser()
		if(!this.cdr['destroyed']){ 
			this.cdr.detectChanges();
		}
	}

	async getUser(){
		await this.userService.getUserById(this.user$.id).toPromise().then(res=>{
			this.user = res.result.data;
			if(this.user.photo_profil){
				this.user.photo_profil.src = this.documentService.readFile(this.user.photo_profil.id);
			}
			this.cdr.markForCheck();
		});
	}
		
	editUser(){
		this.router.navigateByUrl('profile/edit');
	}

	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}


}
