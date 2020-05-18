import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { CommonModule } from '@angular/common';
import * as moment from 'moment';

import { TranslateService } from '@ngx-translate/core';
import { VisiteService, TypeService, ChantierService } from '@app/core/services';
import { Visite, Type, Chantier } from '@app/core/models';
import { NgxPermissionsService } from 'ngx-permissions';
import { AuthService, User } from '@app/core/auth';
import { MatSnackBar } from '@angular/material';
import Swal from 'sweetalert2';
import {extractErrorMessagesFromErrorResponse} from '@app/core/_base/crud';
import {FormStatus} from '@app/core/_base/crud/models/form-status';

@Component({
  selector: 'tf-visite-chantier-add',
  templateUrl: './visite-chantier-add.component.html',
  styleUrls: ['./visite-chantier-add.component.scss']
})
export class VisiteChantierAddComponent implements OnInit {
  
  visite: Visite;
  visiteForm: FormGroup;
	// allRoles: Role[];
  formStatus = new FormStatus();
	loaded = false;
  editMode: boolean = false;
  chantier: Chantier;
  questionsDisplayed: boolean = false;
  // Private properties
  
  constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private visiteFB: FormBuilder,
		// private notificationService: NzNotificationService,
		private visiteService: VisiteService,
		private chantierService: ChantierService,
		private typeService: TypeService,
		private authService: AuthService,
		private cdr: ChangeDetectorRef,
		private permissionsService : NgxPermissionsService,
    private translate:TranslateService,
    public snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.visite = new Visite();
    this.createForm();    
    this.setDynamicValidators();
  }

  createForm() {
		this.visiteForm = this.visiteFB.group({
      'chantier_id': ['', Validators.required],
      'salarie_id': [{value:''}, Validators.required],
      'entreprise_id': [{value:''}, Validators.required],
      'redacteur_id': [{value:'', disabled:true}, Validators.required],
      'date_visite': ['', Validators.required],
      // 'is_validated_redacteur': ['', Validators.required],
      // 'is_validated_visite': ['', Validators.required],
      // 'validated_redacteur_at': ['', Validators.required],
      // 'validated_visite_at': ['', Validators.required],
      'presence_non_conformite': [null, Validators.required],
      'has_rectification_imm': [null, Validators.required],
      'avertissement': [null, Validators.required],
      'type_id': ['', Validators.required],
      'questions': [],
		});
		this.loaded = true;
		this.cdr.detectChanges();
  }
  
  setDynamicValidators() {
    const salarie_id = this.visiteForm.get('salarie_id');
    const entreprise_id = this.visiteForm.get('entreprise_id');

    this.visiteForm.get('salarie_id').valueChanges.subscribe(salarie_id => {
        if (salarie_id != null) {
          entreprise_id.setValidators(null);
          entreprise_id.disable();
        }else{
          entreprise_id.setValidators(Validators.required);
          entreprise_id.enable();
        }
    })
    this.visiteForm.get('entreprise_id').valueChanges.subscribe(entreprise_id => {
        if (entreprise_id != null) {
          salarie_id.setValidators(null);
          salarie_id.disable();
        }else{
          salarie_id.setValidators(Validators.required);
          salarie_id.enable();
        }
    })
  }

  onChantierSelected(chantierId: Number) {
    this.getChantier(chantierId);
  }

  async getChantier(chantierId){
    var res = await this.chantierService.get(chantierId).toPromise();
    this.chantier = res.result.data;
    // this.visiteForm.setValue('chantier_id':this.chantier.id);
    // this.visiteForm.setValue('redacteur_id':this.chantier.charge_affaire_id);
  }

  async onSubmit(event){
    try {
      let form = {...this.visiteForm.value};
      this.formStatus.onFormSubmitting();
  
			this.visiteService.create(form)
        .toPromise()
        .then((visite) => {
          this.cdr.markForCheck();
          
          Swal.fire({
            icon: 'success',
            title: 'Chantié créé avec succès',
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            this.router.navigate(['/visites/list']);
          });
        })
        .catch(err =>{ 

          Swal.fire({
            icon: 'error',
            title: 'Echec! le formulaire est incomplet',
            showConfirmButton: false,
            timer: 1500
          });

          if(err.status === 422){
            var messages = extractErrorMessagesFromErrorResponse(err);
            this.formStatus.onFormSubmitResponse({success: false, messages: messages});
            console.log(this.formStatus.errors, this.formStatus.canShowErrors());
            this.cdr.detectChanges();
            this.cdr.markForCheck();
          }

        });
        
      this.cdr.markForCheck();
    } catch (error) {
      console.error(error);
      throw error;
    }

  }

  setDateFormat(date){
      return date ? moment(date).format('YYYY-MM-DD') : null;
  }

  canDisplayQuestions(){
    this.visiteForm.get('chantier_id').value && this.visiteForm.get('type_id').value;
  }  

  displayQuestions(){
    this.questionsDisplayed = true;
  }
  
}
