import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '@app/core/auth';

@Component({
  selector: 'tf-profile-hse-detail',
  templateUrl: './profile-hse-detail.component.html',
  styleUrls: ['./profile-hse-detail.component.scss']
})
export class ProfileHseDetailComponent implements OnInit, OnDestroy {
  
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
