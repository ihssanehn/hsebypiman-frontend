// Angular
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// RxJS
import { Observable, Subject } from 'rxjs';
// Translate
import { TranslateService } from '@ngx-translate/core';
// Store
import { Store } from '@ngrx/store';
import { AppState } from '../../../../core/reducers';
// Auth
import { DomSanitizer } from '@angular/platform-browser';
import {environment} from '@env/environment';
import { MatIconRegistry } from '@angular/material';
import { AuthNoticeService, AuthService} from '../../../../core/auth';
import { ModuleService } from '@app/core/services';
import { VersionCheckService } from '@app/core/_base/layout';
import Swal from 'sweetalert2';

@Component({
	selector: 'tf-login',
	templateUrl: './login.component.html',
	encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit, OnDestroy {
	// Public params
	loginForm: FormGroup;
	loading = false;
	isLoggedIn$: Observable<boolean>;
	errors: any = [];
	logo: string;
	hide: boolean = true;

	private unsubscribe: Subject<any>;
	private returnUrl: any;


	/**
	 * Component constructor
	 *
	 * @param router: Router
	 * @param auth: AuthService
	 * @param authNoticeService: AuthNoticeService
	 * @param translate: TranslateService
	 * @param store: Store<AppState>
	 * @param fb: FormBuilder
	 * @param cdr
	 * @param route
	 */
	constructor(
		private router: Router,
		private auth: AuthService,
		private moduleService: ModuleService,
		private authNoticeService: AuthNoticeService,
		private translate: TranslateService,
		private store: Store<AppState>,
		private fb: FormBuilder,
		private cdr: ChangeDetectorRef,
		private route: ActivatedRoute,
		private versionCheckService:VersionCheckService,  
		iconRegistry: MatIconRegistry, 
		sanitizer: DomSanitizer

	) {
		this.unsubscribe = new Subject();
		
		iconRegistry.addSvgIcon(
			'close-eye',sanitizer.bypassSecurityTrustResourceUrl('./assets/media/hse-svg/picto-close-see.svg'));
		iconRegistry.addSvgIcon(
			'open-eye',sanitizer.bypassSecurityTrustResourceUrl('./assets/media/hse-svg/picto-open-see.svg'));
	}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit(): void {
		this.versionCheckService.checkVersion(environment.versionCheckURL);
		this.initLoginForm();

		// redirect back to the returnUrl before login
		this.route.queryParams.subscribe(params => {
			this.returnUrl = params.returnUrl || '/';
		});
	}

	/**
	 * On destroy
	 */
	ngOnDestroy(): void {
		this.authNoticeService.setNotice(null);
		this.unsubscribe.next();
		this.unsubscribe.complete();
		this.loading = false;
	}

	/**
	 * Form initalization
	 * Default params, validators
	 */
	initLoginForm() {
		// demo message to show

		this.loginForm = this.fb.group({
			email: [null, Validators.compose([
				Validators.required,
				Validators.email,
				Validators.minLength(3),
				Validators.maxLength(320) // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
			])
			],
			password: [null, Validators.compose([
				Validators.required,
				Validators.minLength(3),
				Validators.maxLength(100)
			])
			]
		});
	}

	/**
	 * Form Submit
	 */
	submit() {
		const controls = this.loginForm.controls;
		/** check form */
		if (this.loginForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			return;
		}

		this.loading = true;

		const authData = {
			email: controls.email.value,
			password: controls.password.value
		};
		this.moduleService.getModules().toPromise();
		this.auth
			.login(authData.email, authData.password)
			.subscribe(res=>{
				
				if(res){
					localStorage.setItem(environment.authTokenKey, res.result.data.access_token);
					localStorage.setItem('user_connection', res.result.data.user_connection);

					this.loading = false;
				
					this.auth
						.getUserByToken()
						.subscribe(res=>{

							if(res.result.data.date_realisation_livret_accueil){
								if(res.result.data.is_firstConnexion){
									this.router.navigateByUrl('/auth/edit-password');
								}else{
									this.router.navigateByUrl(this.returnUrl);
								}
							} else {
								this.router.navigateByUrl('/livret-accueil');
							}

							this.cdr.markForCheck();
						})
				}
			},
			err => {
				if(err.error.code == 401){
					this.authNoticeService.setNotice(this.translate.instant('AUTH.VALIDATION.INVALID_LOGIN'), 'danger');
				}else{
					
					Swal.fire({
						icon: 'error',
						title: 'Accès non autorisé',
						showConfirmButton: false,
						html: err.error.message.content,
						timer: 3000
					});
				}
				this.loading = false;
				this.cdr.markForCheck();
			});
	}

	/**
	 * Checking control validation
	 *
	 * @param controlName: string => Equals to formControlName
	 * @param validationType: string => Equals to valitors name
	 */
	isControlHasError(controlName: string, validationType: string): boolean {
		const control = this.loginForm.controls[controlName];
		if (!control) {
			return false;
		}

		const result = control.hasError(validationType) && (control.dirty || control.touched);
		return result;
	}
}
