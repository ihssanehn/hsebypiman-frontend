import { Component, OnInit, ChangeDetectorRef, Input, OnDestroy } from '@angular/core';
import { Personnel } from '@app/core/models';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import moment from 'moment';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '@app/core/services';
import { NgxPermissionsService } from 'ngx-permissions';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { DateFrToEnPipe, DateEnToFrPipe } from '@app/core/_base/layout';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import {extractErrorMessagesFromErrorResponse} from '@app/core/_base/crud';
import {FormStatus} from '@app/core/_base/crud/models/form-status';
import { User } from '@app/core/auth';

@Component({
  selector: 'tf-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit, OnDestroy {

	// allRoles: Role[];
  loaded = false;
  user: User;
  userForm: FormGroup;
  formStatus = new FormStatus();
  formloading: boolean = false;
	// Private properties
  private subscriptions: Subscription[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
		private router: Router,
		private fb: FormBuilder,
    private UserService: UserService,
		private cdr: ChangeDetectorRef,
		private dateFrToEnPipe:DateFrToEnPipe,
		private dateEnToFrPipe:DateEnToFrPipe,
		private location: Location,
		private permissionsService : NgxPermissionsService
  ) {}

  ngOnInit() {
    const routeSubscription = this.activatedRoute.params.subscribe(
      async params => {
        const id = params.id;
        if (id) {
          this.getUser(id).then(()=>{
            this.createForm();
            this.patchForm(this.user);
          });
        } else {
          this.router.navigateByUrl('/admin/users/list');
        }
      }
    );
  }
  
  async getUser(userId){
		try {
      var res = await this.UserService
      .getUserById(userId).toPromise();
      let user = res.result.data;
      this.parseUserDate(user, 'EnToFr');
      this.user = user;
			this.cdr.markForCheck();
		} catch (error) {
			console.error(error);
		}
  }

  

  createForm() {
    this.userForm = this.fb.group({
      civilite: ['', [Validators]],
      nom: [null, Validators.required],
      prenom: ['', Validators.required],
      date_naissance: ['', [Validators]],
      email: ['', Validators.required],
      telephone: ['', [Validators]],
      date_entree: ['', Validators.required],
      date_sortie: ['', [Validators]],
      fonction_id: ['', [Validators]],
      role_id: [{value:null, disabled:false}, [Validators]],
      nom_urgence: ['', [Validators]],
      telephone_urgence: ['', [Validators]],
      lien_parente_urgence: ['', [Validators]],
      rqth: [0, [Validators]],
      date_visite_medicale_passed: ['', [Validators]],
      date_visite_medicale_next: ['', [Validators]],
      is_blocked: [0, [Validators]]
    })

    this.loaded = true;
    
    this.userForm.get('is_blocked').valueChanges.subscribe((value)=>{
      if(value == 1){
        this.userForm.get('role_id').disable();
      }else{
        this.userForm.get('role_id').enable();
      }
    })
  }

  ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}


  patchForm(item){
    this.userForm.patchValue(item);
    console.log(this.userForm);
  }

      
  onSubmit(){
    this.formloading = true;
    let form = {...this.userForm.getRawValue()};
    this.parseUserDate(form, 'FrToEn');
    form.id = this.user.id;
    this.UserService.updateUser(form)
      .toPromise()
      .then((res) => {
        
        this.formloading = false;
        var code = res.message.code as SweetAlertIcon;
        var message = res.message.content != 'done' ? '<b class="text-'+code+'">'+res.message.content+'</b>' : null; 
        Swal.fire({
          icon: code,
          title: 'Utilisateur mis à jour avec succès',
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
          title: 'Echec! le formulaire est incomplet',
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

    

  parseUserDate(item, direction){
    item.date_naissance = direction == 'FrToEn' ? this.dateFrToEnPipe.transform(item.date_naissance) : this.dateEnToFrPipe.transform(item.date_naissance);
    item.date_entree = direction == 'FrToEn' ? this.dateFrToEnPipe.transform(item.date_entree) : this.dateEnToFrPipe.transform(item.date_entree);
    item.date_sortie = direction == 'FrToEn' ? this.dateFrToEnPipe.transform(item.date_sortie) : this.dateEnToFrPipe.transform(item.date_sortie);
    item.date_visite_medicale_passed = direction == 'FrToEn' ? this.dateFrToEnPipe.transform(item.date_visite_medicale_passed) : this.dateEnToFrPipe.transform(item.date_visite_medicale_passed);
    item.date_visite_medicale_next = direction == 'FrToEn' ? this.dateFrToEnPipe.transform(item.date_visite_medicale_next) : this.dateEnToFrPipe.transform(item.date_visite_medicale_next);
  }

}
