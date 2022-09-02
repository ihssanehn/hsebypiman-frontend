import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { UserService } from '@app/core/services';
import { AuthService, User } from '@app/core/auth';

@Component({
  selector: 'tf-profile-detail',
  templateUrl: './profile-detail.component.html',
  styleUrls: ['./profile-detail.component.scss']
})
export class ProfileDetailComponent implements OnInit, OnDestroy {
  
	userId: number;
	private subscriptions: Subscription[] = [];
  
	constructor(
		private authService: AuthService
	) {
		this.authService.currentUser.subscribe(user => this.userId = user.id);
	}
  
	ngOnInit() {

	}

	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}
}
