import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Personnel } from '@app/core/models';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { FormStatus } from '@app/core/_base/crud/models/form-status';
import { Router } from '@angular/router';
import { UserService } from '@app/core/services';
import Swal from 'sweetalert2';
import { extractErrorMessagesFromErrorResponse } from '@app/core/_base/crud';
import { DateFrToEnPipe, DateEnToFrPipe } from '@app/core/_base/layout';

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


  constructor(
    private router: Router,
    private userFB: FormBuilder,
    private UserService: UserService,
    private cdr: ChangeDetectorRef,
    private location: Location,
    private dateFrToEnPipe:DateFrToEnPipe,
    private dateEnToFrPipe:DateEnToFrPipe,
  ) { }

  ngOnInit() {
    this.user = new Personnel();
    this.createForm();
    this.setDynamicValidators();
  }

  createForm() {
		this.userForm = this.userFB.group({
      civilite: ['', [Validators]],
      nom: [null, Validators.required],
      prenom: ['', Validators.required],
      date_naissance: ['', [Validators]],
      email: ['', Validators.required],
      telephone: ['', [Validators]],
      date_entree: ['', Validators.required],
      date_sortie: ['', [Validators]],
      role_id: ['', [Validators]],
      fonction_id: ['', [Validators]],
      nom_urgence: ['', [Validators]],
      telephone_urgence: ['', [Validators]],
      lien_parente_urgence: ['', [Validators]],
      rqth: [0, [Validators]],
      date_visite_medicale_passed: ['', [Validators]],
      date_visite_medicale_next: ['', [Validators]],
      is_blocked: [0, [Validators]]
    });
    this.loaded = true;
    
    this.userForm.get('is_blocked').valueChanges.subscribe((value)=>{
      if(value == 1){
        this.userForm.get('role_id').disable();
      }else{
        this.userForm.get('role_id').enable();
      }
    })
  }

  setDynamicValidators(){
    //const no_hab_required = this.userForm.get('no_hab_required');
  }

  async onSubmit(){
    try {
      let result;
      this.formloading = true;
      let form = {...this.userForm.getRawValue()};
      this.parseDates(form, 'FrToEn');
      this.formStatus.onFormSubmitting();
  
			this.UserService.createUser(form)
        .toPromise()
        .then((res) => {
          this.formloading = false;
          this.errors = false; 
          this.cdr.markForCheck();
          var user = res.result.data;
          Swal.fire({
            icon: 'success',
            title: 'Utilisateur créé avec succès',
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
