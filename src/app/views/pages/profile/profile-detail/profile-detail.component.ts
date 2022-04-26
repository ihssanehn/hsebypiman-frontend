import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from "rxjs";
import { User, AuthService } from '@app/core/auth';

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
		private cdr: ChangeDetectorRef,
	) {
		this.authService.currentUser.subscribe(x=> this.user$ = x);
	}

	ngOnInit() {
		this.user = this.user$
		if(!this.cdr['destroyed']){ 
			this.cdr.detectChanges();
		}
	}
		
	editUser(){
		this.router.navigateByUrl('profile/edit');
	}

	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}

}
