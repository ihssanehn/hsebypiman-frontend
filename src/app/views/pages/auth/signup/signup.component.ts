// Angular
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// RxJS
import { finalize, takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';
// Translate
import { TranslateService } from '@ngx-translate/core';
// Auth
import { AuthNoticeService, AuthService } from '../../../../core/auth';
import { Type } from '@app/core/models';
import { BuService, EntityService } from '@app/core/services';


@Component({
  selector: 'tf-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

	// Public params
	signupForm: FormGroup;
	loading = false;
	errors: any = [];

  entities: Type[];
  buList: Type[];
  entitiesLoaded: boolean = false;
  buLoaded: boolean = false;

	private unsubscribe: Subject<any>;

	/**
	 * Component constructor
	 *
	 * @param authService
	 * @param authNoticeService
	 * @param translate
	 * @param router
	 * @param fb
	 * @param cdr
	 */
	constructor(
		private authService: AuthService,
		public authNoticeService: AuthNoticeService,
    private entityService: EntityService,
    private buService: BuService,
		private translate: TranslateService,
		private router: Router,
		private fb: FormBuilder,
		private cdr: ChangeDetectorRef
	) {
		this.unsubscribe = new Subject();
	}

	/**
	 * On init
	 */
	ngOnInit() {
		this.initRegistrationForm();
    this.getEntities();
    this.getBu();
	}

	/**
	 * On destroy
	 */
	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
		this.loading = false;
	}

  async getEntities(){
    this.entitiesLoaded = false;
    var res = await this.entityService.getList().toPromise();
    if(res){
      this.entities = res.result.data;
      this.entitiesLoaded = true;
    }
    this.cdr.markForCheck();
  }

  async getBu(){
    this.buLoaded = false;
    var res = await this.buService.getList().toPromise();
    if(res){
      this.buList = res.result.data;
      this.buLoaded = true;
    }
    this.cdr.markForCheck();
  }

	/**
	 * Form initalization
	 * Default params, validators
	 */
	initRegistrationForm() {
		this.signupForm = this.fb.group({
			nom: ['', Validators.required],
			prenom: ['', Validators.required],
			email: ['', Validators.compose([
					Validators.required,
					Validators.email,
					Validators.minLength(3),
					Validators.maxLength(320)
				])
			],
			entity_id: ['', Validators.required],
			bu_id: ['', Validators.required]
		});
	}

  isFieldRequired(controlName){
    if(this.signupForm && this.signupForm.controls[controlName]){
      const control = this.signupForm.controls[controlName]
      const { validator } = control
      if (validator) {
          const validation = validator(new FormControl())
          return validation !== null && validation.required === true
      }
    }
    return false
  }

	/**
	 * Form Submit
	 */
	submit() {
		const controls = this.signupForm.controls;
		/** check form */
		if (this.signupForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			return;
		}

		this.loading = true;

    	let formData = {...this.signupForm.getRawValue()};
			this.authService.signup(formData)
			.subscribe(
				res=>{
				
					if(res){
						this.authNoticeService.setNotice(this.translate.instant('AUTH.REQUEST_ACCESS.SUCCESS'), 'success');
						this.router.navigateByUrl('/auth/login');
						this.loading = false;
					}
				},
				err => {
					this.authNoticeService.setNotice(this.translate.instant('NOTIF.ACCOUNT_ALREADY_EXISTS.TITLE'), 'danger');
					this.loading = false;
					this.cdr.markForCheck();
				}
			);
		
	}

	/**
	 * Checking control validation
	 *
	 * @param controlName: string => Equals to formControlName
	 * @param validationType: string => Equals to valitors name
	 */
	isControlHasError(controlName: string, validationType: string): boolean {
		const control = this.signupForm.controls[controlName];
		if (!control) {
			return false;
		}

		const result =
			control.hasError(validationType) &&
			(control.dirty || control.touched);
		return result;
	}

}
