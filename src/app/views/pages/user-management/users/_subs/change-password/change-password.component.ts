// Angular
import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { User, AuthService } from '@app/core/auth';
import { FormBuilder, Validators } from '@angular/forms';
// import { NzNotificationService } from 'ng-zorro-antd/notification';



@Component({
	selector: 'tf-change-password',
	templateUrl: './change-password.component.html',
	styleUrls: ['./change-password.component.scss']
	// changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePasswordComponent implements OnInit {
	hasFormErrors = false;
	@Input() user: User;
	changePasswordForm: any;

	/**
	 * Component constructor
	 *
	 * @param fb: FormBuilder
	 * @param auth: AuthService
	 */
	constructor(private fb: FormBuilder, private authService: AuthService,
		// private notificationService: NzNotificationService
		) {
	}

	
	ngOnInit() {
		this.createForm();
	}

	createForm() {
		this.changePasswordForm = this.fb.group({
			password: ['', Validators.required],
			confirmPassword: ['', Validators.required]
		});
	}

	
	async onSubmit() {
		const message = `User password successfully has been changed.`;
		const newUser = new User();
		newUser.password = this.password.value;
		newUser.id = this.user.id;
		// await this.userService.updateUser(newUser).toPromise();
		// this.notificationService.success("Success", message);
	}


	clearForm(){
		this.changePasswordForm.reset();
	}

	get password(){
		return this.changePasswordForm.get('password');
	}

	get confirmPassword(){
		return this.changePasswordForm.get('confirmPassword');
	}
}
