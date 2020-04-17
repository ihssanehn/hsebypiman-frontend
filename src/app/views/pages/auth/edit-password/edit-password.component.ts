import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { tap, takeUntil, finalize } from 'rxjs/operators';
import { AuthService, AuthNoticeService, User } from '@app/core/auth';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import { environment } from '@env/environment';

@Component({
  selector: 'tf-edit-password',
  templateUrl: './edit-password.component.html',
  styleUrls: ['./edit-password.component.scss']
})
export class EditPasswordComponent implements OnInit, OnDestroy {

  user: User;
  editPasswordForm: FormGroup;
	loading = false;
	errors: any = [];
  private unsubscribe: Subject<any>;
  pwd_hide: boolean = true;
  confirm_pwd_hide: boolean = true;


  constructor(
    private authService: AuthService,
    public authNoticeService: AuthNoticeService,
		private translate: TranslateService,
		private router: Router,
		private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    iconRegistry: MatIconRegistry, 
		sanitizer: DomSanitizer
  ) { 
    this.unsubscribe = new Subject();

    iconRegistry.addSvgIcon(
			'close-eye',sanitizer.bypassSecurityTrustResourceUrl('./assets/media/hse-svg/picto-close-see.svg'));
		iconRegistry.addSvgIcon(
			'open-eye',sanitizer.bypassSecurityTrustResourceUrl('./assets/media/hse-svg/picto-open-see.svg'));
  }

  ngOnInit() {
    this.initEditPasswordForm();
    this.getAuthUser();
  }

  initEditPasswordForm() {
		this.editPasswordForm = this.fb.group({
			password: [null, Validators.compose([
        Validators.required,
				Validators.minLength(3),
				Validators.maxLength(100)
			])
			],
			confirm_password: [null, Validators.compose([
				Validators.required
			])
			]
		}, {validator: this.checkPasswords });
  }
  
  async getAuthUser() {
		const userToken = localStorage.getItem(environment.authTokenKey);
		if (userToken) {
      var res = await this.authService.getUserByToken().toPromise();
			this.user = res.result.data;
		} else {
			localStorage.removeItem(environment.authTokenKey);
			this.router.navigate(['/auth/login']);
			return false;
		}
	}

  /**
	 * Form Submit
	 */
  submit() {
		const controls = this.editPasswordForm.controls;

		if (this.editPasswordForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			return;
		}

		this.loading = true;

    this.user.password = controls.password.value;

		this.authService.updateUser(this.user).pipe(
			tap(response => {
				if (response) {
					this.authNoticeService.setNotice(this.translate.instant('AUTH.EDIT.SUCCESS'), 'success');
					this.router.navigateByUrl('/auth/login');
				} else {
					this.authNoticeService.setNotice(this.translate.instant('AUTH.VALIDATION.NOT_FOUND', {
            name: this.translate.instant('AUTH.INPUT.EMAIL')
          }), 'danger');
				}
			}),
			takeUntil(this.unsubscribe),
			finalize(() => {
				this.loading = false;
				this.cdr.markForCheck();
			})
		).subscribe();
  }
  
	/**
	 * Checking control validation
	 *
	 * @param controlName: string => Equals to formControlName
	 * @param validationType: string => Equals to valitors name
	 */
  isControlHasError(controlName: string, validationType: string): boolean {
		const control = this.editPasswordForm.controls[controlName];
		if (!control) {
			return false;
		}

		const result =
			control.hasError(validationType) &&
			(control.dirty || control.touched);
		return result;
  }
  
  checkPasswords(group: FormGroup) {
    let pass = group.controls['password'];
    let confirmPass = group.controls['confirm_password'];

    if (pass.value !== confirmPass.value) {
      confirmPass.setErrors({ notSame: true });
    } else {
      confirmPass.setErrors(null);
    } 
  }

  ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
		this.loading = false;
	}

}
