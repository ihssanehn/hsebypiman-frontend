// Angular
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// RxJS
import { finalize, takeUntil, tap, debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';
// Translate
import { TranslateService } from '@ngx-translate/core';
// Auth
import { AuthNoticeService, AuthService } from '../../../../core/auth';
import { Type } from '@app/core/models';
import { BuService, EntityService } from '@app/core/services';
import { environment } from '@env/environment';
import Swal from 'sweetalert2';


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
	notPimanError:boolean = false;
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
					Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"),
					Validators.minLength(3),
					Validators.maxLength(320)
				])
			],
			entity_id: ['', Validators.required],
			bu_id: ['', Validators.required],
			entreprise_autre: ['', Validators.required],
			fonction_autre: [''],
			telephone: ['']
		});

		const email = this.signupForm.get('email') as FormControl;
		const entity_id = this.signupForm.get('entity_id') as FormControl;
		const bu_id = this.signupForm.get('bu_id') as FormControl;
		const entreprise_autre = this.signupForm.get('entreprise_autre') as FormControl;
		const fonction_autre = this.signupForm.get('fonction_autre') as FormControl;
		const telephone = this.signupForm.get('telephone') as FormControl;

		email.valueChanges.pipe(
      debounceTime(200)
		).subscribe(value=>{
			if(this.signupForm.controls['email'].invalid) return;

			if(this.isPimanEmail(value)){

				localStorage.setItem(environment.entity, 'piman');
				this.getEntities();
    		this.getBu();
				this.cdr.markForCheck();

				entity_id.enable();
				entity_id.setValidators([Validators.required]);
				bu_id.enable();
				bu_id.setValidators([Validators.required]);

				entreprise_autre.disable();
				entreprise_autre.setValidators([]);
				fonction_autre.disable();
				telephone.disable();
			

			}else{

				entreprise_autre.enable();
				entreprise_autre.setValidators([Validators.required]);
				fonction_autre.enable();
				telephone.enable();

				entity_id.disable();
				entity_id.setValidators([]);
				bu_id.disable();
				bu_id.setValidators([]);

				localStorage.setItem(environment.entity, 'demo');

			}
			this.signupForm.updateValueAndValidity();
		})

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


	isPimanEmail = (email)=>email.includes('@piman-group.fr')

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
