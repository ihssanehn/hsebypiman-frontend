import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { UserService } from '@app/core/services';
import { Location } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { User, AuthService } from '@app/core/auth';
import {extractErrorMessagesFromErrorResponse} from '@app/core/_base/crud';
import { FormStatus } from '@app/core/_base/crud/models/form-status';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'tf-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss']
})
export class ProfileEditComponent implements OnInit, OnDestroy {
  
  	
	

	// Private properties
	private subscriptions: Subscription[] = [];

	private user$: User;

	loaded: boolean = false;
	passForm: FormGroup;
	userForm: FormGroup;
	passFormloading: boolean = false;
	passFormStatus = new FormStatus();
	userFormloading: boolean = false;
	userFormStatus = new FormStatus();
  formStatus = new FormStatus();


	errors: any = [];

	old_pwd_hide: boolean = true;
	new_pwd_hide: boolean = true;
	confirm_pwd_hide: boolean = true;


	/**
	 * Component constructor
	 *
	 * @param activatedRoute: ActivatedRoute
	 * @param router: Router
	 * @param actionFB: FormBuilder
	 * @param layoutUtilsService: LayoutUtilsService
	 */
	constructor(
			private fb: FormBuilder,
			private UserService: UserService,
			private location: Location,
			private cdr: ChangeDetectorRef,
			private authService: AuthService,
			iconRegistry: MatIconRegistry, 
			sanitizer: DomSanitizer,
			private translate: TranslateService
	) {
		this.authService.currentUser.subscribe(x=> this.user$ = x);
		
		iconRegistry.addSvgIcon(
			'close-eye',sanitizer.bypassSecurityTrustResourceUrl('./assets/media/hse-svg/picto-close-see.svg'));
		iconRegistry.addSvgIcon(
			'open-eye',sanitizer.bypassSecurityTrustResourceUrl('./assets/media/hse-svg/picto-open-see.svg'));
	}

	
	ngOnInit() {
		this.initEditPasswordForm();
	}
	

	
 	
 initEditPasswordForm() {
		this.passForm = this.fb.group({
			old_pass: [
				null,
				Validators.compose([
					Validators.required,
					Validators.minLength(6),
					Validators.maxLength(100)
				])
			],
			new_pass: [
				null, 
				Validators.compose([
					Validators.required,
					Validators.minLength(6),
					Validators.maxLength(100)
				])
			],
			new_pass_confirmation: [
				null, 
					Validators.compose([
						Validators.required
					])
			]
		}, {validator: this.checkPasswords });
		
	  this.userForm = this.fb.group({
		  nom: [null, Validators.required],
		  prenom: [null, Validators.required],
		  email: [null, Validators.required],
		})
		this.userForm.patchValue(this.user$);

	  this.loaded = true;
		this.cdr.markForCheck();
  }
  

	/**
	 * Checking control validation
	 *
	 * @param controlName: string => Equals to formControlName
	 * @param validationType: string => Equals to valitors name
	 */
  isControlHasError(form: FormGroup, controlName: string, validationType: string): boolean {
		const control = form.controls[controlName];
		if (!control) {
			return false;
		}

		const result = control.hasError(validationType) && (control.dirty || control.touched);
		return result;
  }
  
  checkPasswords(group: FormGroup) {
    let pass = group.controls['new_pass'];
    let confirmPass = group.controls['new_pass_confirmation'];

    if (pass.value !== confirmPass.value) {
      confirmPass.setErrors({ notSame: true });
    } else {
      confirmPass.setErrors(null);
    }
  }

  
	createForm() {
	  this.passForm = this.fb.group({
		
			oldPass: [{value:null, disabled:false}, Validators.required],
			newPass: [{value:'', disabled:false}, Validators.required],
			confirmNewPass: [{value:'', disabled:false}, Validators.required],
	  });
	}
 
  
	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}
  
		
	onUserSubmit(){
		this.userFormloading = true;
    let form = {...this.userForm.getRawValue()};
    form.id = this.user$.id;
    this.UserService.updateUser(form)
      .toPromise()
      .then((res) => {
        
        this.userFormloading = false;
        var code = res.message.code as SweetAlertIcon;
        var message = res.message.content != 'done' ? '<b class="text-'+code+'">'+res.message.content+'</b>' : null; 
				this.authService.reloadUser().toPromise().then(res=>console.log(res));
        Swal.fire({
          icon: code,
          title: this.translate.instant("USERS.NOTIF.USER_UPDATED.TITLE"),
          showConfirmButton: false,
          html: message,
          timer: code == 'success' ? 1500 : 3000
        }).then(() => {
          // this.location.back();
        })
        this.cdr.markForCheck();
      })
      .catch(err => {
        
        this.userFormloading = false;
        Swal.fire({
          icon: 'error',
          title: this.translate.instant("ARS.NOTIF.INCOMPLETE_FORM.TITLE"),
          showConfirmButton: false,
          timer: 1500
        });
    
        if(err.status === 422){
          var messages = extractErrorMessagesFromErrorResponse(err);
          this.formStatus.onFormSubmitResponse({success: false, messages: messages});
          this.cdr.markForCheck();
        }
      });
    this.cdr.markForCheck();
	}

	onPassSubmit(){
		const controls = this.passForm.controls;
		if (this.passForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			return;
		}
	  this.passFormloading = true;
	  let form = {...this.passForm.getRawValue()};
	  form.id = this.user$.id;
		

	  this.UserService.updatePass(form)
		.toPromise()
		.then((res) => {
		  
		  this.passFormloading = false;
		  var code = res.message.code as SweetAlertIcon;
		  var message = res.message.content != 'done' ? '<b class="text-'+code+'">'+res.message.content+'</b>' : null; 
		  Swal.fire({
				icon: code,
				title: 'Mot de passe mis à jour avec succès',
				showConfirmButton: false,
				html: message,
				timer: code == 'success' ? 1500 : 3000
		  }).then(() => {
				this.location.back();
		  })
		  	this.cdr.markForCheck();
		})
		.catch(err => {
		  
		  this.passFormloading = false;
		  Swal.fire({
				icon: 'error',
				title: 'Echec! le formulaire est incomplet ou le mot de passe ne correspond pas',
				showConfirmButton: false,
				timer: 1500
		  });
	  
		  if(err.status === 422){
				var messages = extractErrorMessagesFromErrorResponse(err);
				this.passFormStatus.onFormSubmitResponse({success: false, messages: messages});
				this.cdr.markForCheck();
		  }
		});
	  this.cdr.markForCheck();
	}
  
	onCancel(){
	  this.location.back();
	}

}
