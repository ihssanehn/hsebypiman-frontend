import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Personnel } from '@app/core/models';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Location } from '@angular/common';
import { FormStatus } from '@app/core/_base/crud/models/form-status';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService, PersonnelService } from '@app/core/services';
import Swal from 'sweetalert2';
import { extractErrorMessagesFromErrorResponse } from '@app/core/_base/crud';
import { DateFrToEnPipe, DateEnToFrPipe } from '@app/core/_base/layout';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'tf-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.scss']
})
export class UserAddComponent implements OnInit {

  user: Personnel;
  userForm: FormGroup;
  formStatus = new FormStatus();
  formloading: Boolean = false;
  loaded = false;
  errors;
  _state : any;


  constructor(
    private router: Router,
    private userFB: FormBuilder,
    private UserService: UserService,
    private cdr: ChangeDetectorRef,
    private location: Location,
    private dateFrToEnPipe:DateFrToEnPipe,
    private dateEnToFrPipe:DateEnToFrPipe,
    private translate: TranslateService,
    private personnelService: PersonnelService,
  ) { }

  ngOnInit() {
    this.user = new Personnel();
    this.createForm();

    this._state = this.location.getState() as any;
    if(this._state.interimaire){
      this.patchForm(this._state.interimaire);
    }
  }

  createForm() {
		this.userForm = this.userFB.group({
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

  patchForm(interimaire){
    this.personnelService.getUserById(interimaire.id).toPromise().then(res=>{
      var perso = res.result.data as any;

      this.parseDates(perso, 'EnToFr');
      this.userForm.patchValue({
        is_virtual:perso.is_virtual,
        civilite:perso.civilite == 'M' ? 'M.' : 'Mme',
        nom:perso.nom,
        prenom:perso.prenom,
        date_naissance:perso.date_naissance,
        email:perso.email,
        telephone:perso.telephone,
        date_entree:perso.date_entree,
        date_sortie:perso.date_sortie,
        nom_urgence:perso.nom_urgence,
        telephone_urgence:perso.telephone_urgence,
        lien_parente_urgence:perso.lien_parente_urgence,
        rqth:perso.rqth,
        date_visite_medicale_passed:perso.date_visite_medicale_passed,
        date_visite_medicale_next:perso.date_visite_medicale_next,
      });
    })
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
        this.userForm.get('role_id').setValidators([]);
      }else{
        this.userForm.get('role_id').enable();
        this.userForm.get('role_id').setValidators([Validators.required]);
      }
      this.userForm.updateValueAndValidity();
    })
  }

  async onSubmit(){
    try {
      let result;
      this.formloading = true;
      let form = {...this.userForm.getRawValue()};
      this.parseDates(form, 'FrToEn');
      this.formStatus.onFormSubmitting();
      if(this._state.interimaire){
        form.personnel_id = this._state.interimaire.id;
      }
			this.UserService.createUser(form)
        .toPromise()
        .then((res) => {
          this.formloading = false;
          this.errors = false; 
          this.cdr.markForCheck();
          var user = res.result.data;
          Swal.fire({
            icon: 'success',
            title: this.translate.instant("USERS.NOTIF.USER_CREATED.TITLE"),
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            this.router.navigate(['admin/users/detail/' + user.id]);
          });
        })
        .catch(err =>{ 
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
    } catch (error) {
      this.formloading = false;
      console.error(error);
      throw error;
    }

  }

  parseDates(item, direction){
		item.date_naissance = direction == 'FrToEn' ? this.dateFrToEnPipe.transform(item.date_naissance) : this.dateEnToFrPipe.transform(item.date_naissance);
    item.date_entree = direction == 'FrToEn' ? this.dateFrToEnPipe.transform(item.date_entree) : this.dateEnToFrPipe.transform(item.date_entree);
    item.date_sortie = direction == 'FrToEn' ? this.dateFrToEnPipe.transform(item.date_sortie) : this.dateEnToFrPipe.transform(item.date_sortie);
    item.date_visite_medicale_passed = direction == 'FrToEn' ? this.dateFrToEnPipe.transform(item.date_visite_medicale_passed) : this.dateEnToFrPipe.transform(item.date_visite_medicale_passed);
    item.date_visite_medicale_next = direction == 'FrToEn' ? this.dateFrToEnPipe.transform(item.date_visite_medicale_next) : this.dateEnToFrPipe.transform(item.date_visite_medicale_next);
  }

  onCancel() {
		this.location.back();
  }

}
