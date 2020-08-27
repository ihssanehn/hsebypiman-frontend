import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { BehaviorSubject, Observable, of, Subscription } from "rxjs";

import { ActionService, TypeService, PersonnelService, UserService } from '@app/core/services';
import { Paginate } from '@app/core/_base/layout/models/paginate.model';
import { Action } from '@app/core/models';
import { NgxPermissionsService } from 'ngx-permissions';
import { Location } from '@angular/common';

import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { User, AuthService } from '@app/core/auth';
import {extractErrorMessagesFromErrorResponse} from '@app/core/_base/crud';
import { FormStatus } from '@app/core/_base/crud/models/form-status';

@Component({
  selector: 'tf-profile-password',
  templateUrl: './profile-password.component.html',
  styleUrls: ['./profile-password.component.scss']
})
export class ProfilePasswordComponent implements OnInit, OnDestroy {
  
  	
	

	// Private properties
	private subscriptions: Subscription[] = [];

	private user$: User;

	loaded: boolean = false;
	passForm: FormGroup;
	formloading: boolean = false;
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
			private permissionsService : NgxPermissionsService,
			private activatedRoute: ActivatedRoute,
			private router: Router,
			// private notificationService: NzNotificationService,
			private cdr: ChangeDetectorRef,
			private authService: AuthService,
			iconRegistry: MatIconRegistry, 
			sanitizer: DomSanitizer
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
		this.loaded = true;
		this.cdr.markForCheck();
  }
  

	/**
	 * Checking control validation
	 *
	 * @param controlName: string => Equals to formControlName
	 * @param validationType: string => Equals to valitors name
	 */
  isControlHasError(controlName: string, validationType: string): boolean {
		const control = this.passForm.controls[controlName];
		if (!control) {
			return false;
		}

		const result =
			control.hasError(validationType) &&
			(control.dirty || control.touched);
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
	  
	  this.loaded = true;
	  
	}
 
  
	ngOnDestroy() {
		  this.subscriptions.forEach(sb => sb.unsubscribe());
	  }
  
		
	onSubmit(){
		const controls = this.passForm.controls;
		if (this.passForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			return;
		}
	  this.formloading = true;
	  let form = {...this.passForm.getRawValue()};
	  form.id = this.user$.id;
		

	  this.UserService.updatePass(form)
		.toPromise()
		.then((res) => {
		  
		  this.formloading = false;
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
		  
		  this.formloading = false;
		  Swal.fire({
			icon: 'error',
			title: 'Echec! le formulaire est incomplet ou le mot de passe ne correspond pas',
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
  
	onCancel(){
	  this.location.back();
	}

}
