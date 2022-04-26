import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '@app/core/services';
import { DateFrToEnPipe, DateEnToFrPipe } from '@app/core/_base/layout';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import {extractErrorMessagesFromErrorResponse} from '@app/core/_base/crud';
import {FormStatus} from '@app/core/_base/crud/models/form-status';
import { User } from '@app/core/auth';
import { TranslateService } from '@ngx-translate/core';

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
    private translate: TranslateService
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
      is_virtual: [0, [Validators]],
      civilite: [{value:'', disabled:false}, [Validators]],
      nom: [{value:null, disabled:false}, Validators.required],
      prenom: [{value:'', disabled:false}, Validators.required],
      date_naissance: [{value:'', disabled:false}, [Validators]],
      email: [{value:'', disabled:false}, Validators.required],
      telephone: [{value:'', disabled:false}, [Validators]],
      date_entree: [{value:'', disabled:false}, [Validators]],
      date_sortie: [{value:'', disabled:false}, [Validators]],
      role_id: [{value:'', disabled:false}, [Validators]],
      fonction_id: [{value:'', disabled:false}, [Validators]],
      entity_id: [{value:'', disabled:false}, [Validators]],
      bu_id: [{value:'', disabled:false}, [Validators]],
      profit_center_id: [{value:'', disabled:false}, [Validators]],
      client_id: [{value:'', disabled:false}, [Validators]],
      nom_urgence: [{value:'', disabled:false}, [Validators]],
      telephone_urgence: [{value:'', disabled:false}, [Validators]],
      lien_parente_urgence: [{value:'', disabled:false}, [Validators]],
      rqth: [{value:0, disabled:false}, [Validators]],
      date_visite_medicale_passed: [{value:'', disabled:false}, [Validators]],
      date_visite_medicale_next: [{value:'', disabled:false}, [Validators]],
      is_blocked: [{value:0, disabled:false}, [Validators]]
    });
    this.loaded = true;
    
    this.setDynamicForm();
  }

  setDynamicForm(){
    this.userForm.get('is_virtual').valueChanges.subscribe((value)=>{
      const date_entree = this.userForm.get('date_entree') as FormControl;
      const fonction_id = this.userForm.get('date_sortie') as FormControl;
      const date_sortie = this.userForm.get('fonction_id') as FormControl;
      const telephone_urgence = this.userForm.get('nom_urgence') as FormControl;
      const nom_urgence = this.userForm.get('telephone_urgence') as FormControl;
      const rqth = this.userForm.get('lien_parente_urgence') as FormControl;
      const lien_parente_urgence = this.userForm.get('rqth') as FormControl;
      const date_visite_medicale_next = this.userForm.get('date_visite_medicale_passed') as FormControl;
      const date_visite_medicale_passed = this.userForm.get('date_visite_medicale_next') as FormControl;
      const date_naissance = this.userForm.get('date_naissance') as FormControl;
      if(value == 1){
        date_naissance.disable();
        date_naissance.setValidators([]);
        date_entree.disable();
        date_sortie.disable();
        fonction_id.disable();
        nom_urgence.disable();
        telephone_urgence.disable();
        lien_parente_urgence.disable();
        rqth.disable();
        date_visite_medicale_passed.disable();
        date_visite_medicale_next.disable();
      }else{
        date_naissance.enable();
        date_entree.enable();
        date_sortie.enable();
        fonction_id.enable();
        nom_urgence.enable();
        telephone_urgence.enable();
        lien_parente_urgence.enable();
        rqth.enable();
        date_visite_medicale_passed.enable();
        date_visite_medicale_next.enable();
      }

      date_entree.updateValueAndValidity();
      fonction_id.updateValueAndValidity();
      date_sortie.updateValueAndValidity();
      telephone_urgence.updateValueAndValidity();
      nom_urgence.updateValueAndValidity();
      rqth.updateValueAndValidity();
      lien_parente_urgence.updateValueAndValidity();
      date_visite_medicale_next.updateValueAndValidity();
      date_visite_medicale_passed.updateValueAndValidity();
      date_naissance.updateValueAndValidity();

    })
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
          title: this.translate.instant("USERS.NOTIF.USER_UPDATED.TITLE"),
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
