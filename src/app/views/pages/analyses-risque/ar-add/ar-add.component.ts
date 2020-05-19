import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, NgModel, FormControlName } from "@angular/forms";
import { CommonModule } from '@angular/common';
import * as moment from 'moment';

import { TranslateService } from '@ngx-translate/core';
import { ArService, TypeService, ChantierService, ParamsService } from '@app/core/services';
import { Observable, Subscription } from 'rxjs';
import { map, startWith, tap, distinctUntilChanged } from 'rxjs/operators';
import { Paginate } from '@app/core/_base/layout/models/paginate.model';
import { Ar, Type, Chantier } from '@app/core/models';
import { NgxPermissionsService } from 'ngx-permissions';
import { AuthService, User } from '@app/core/auth';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import Swal from 'sweetalert2';
import { DateFrToEnPipe, DateEnToFrPipe } from '@app/core/_base/layout';
import { Param } from '@app/core/models/param.model';
import {extractErrorMessagesFromErrorResponse} from '@app/core/_base/crud';
import {FormStatus} from '@app/core/_base/crud/models/form-status';

@Component({
  selector: 'tf-ar-add',
  templateUrl: './ar-add.component.html',
  styleUrls: ['./ar-add.component.scss']
})
export class ArAddComponent implements OnInit, OnDestroy {

  ar: Ar;
  chantier: Chantier;
  arForm: FormGroup
  formStatus = new FormStatus();
  types: Type[];
  users: User[];
  params: Param[];
  // allRoles: Role[];
  enableBtn = false;
	loaded = false;
  editMode: boolean = false;
  filter = {
    keyword: "",
  }
  // Private properties
  private subscriptions: Subscription[] = [];
  
  constructor(
    private activatedRoute: ActivatedRoute,
		private router: Router,
		private arFB: FormBuilder,
		private arService: ArService,
		private typeService: TypeService,
    private authService: AuthService,
    protected chantierService:ChantierService,
    protected paramsService:ParamsService,
		private cdr: ChangeDetectorRef,
		private dateFrToEnPipe: DateFrToEnPipe,
		private permissionsService : NgxPermissionsService,
    private translate:TranslateService,
    iconRegistry: MatIconRegistry, 
    sanitizer: DomSanitizer
  ) {

    iconRegistry.addSvgIcon(
      'search',sanitizer.bypassSecurityTrustResourceUrl('./assets/media/hse-svg/search.svg'));
  }

  ngOnInit() {
    this.getParams();

    const routeSubscription = this.activatedRoute.queryParams
    .subscribe(
      async params => {
        const id = params.ar_id;
        if(id){
          this.arService
          .get(id)
          .pipe(
            tap(
              ar => {
                this.arForm.patchValue(ar.result.data);
                this.fillForm(ar.result.data);
              }
            )
         )
          .subscribe( async res => {
            this.ar = res.result.data;
            this.loaded = true;
            this.cdr.detectChanges();
            this.cdr.markForCheck();
          });
        }else{
          this.ar = new Ar();
        }
      }
    );
    this.subscriptions.push(routeSubscription);

    this.getTypes();
    this.getUsers();
  }

  ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}

  fillForm(ar: Ar){

		const riskformArray: FormArray = this.arForm.get('risques') as FormArray;
		ar.risques.forEach(element => {
			riskformArray.push(new FormControl(element.id));
		});

		const equipementFormArray: FormArray = this.arForm.get('equipements') as FormArray;
		ar.equipements.forEach(element => {
			equipementFormArray.push(new FormControl(element.id));
		});
		
		const zoneFormArray: FormArray = this.arForm.get('zones') as FormArray;
		ar.zones.forEach(element => {
			zoneFormArray.push(new FormControl(element.id));
		});

		const commentsFormArray: FormArray = this.arForm.get('comments') as FormArray;
		ar.cat_risques.forEach(element => {
			const commentGroup: FormGroup = this.arFB.group({
				'cat_risque_id': element.id,
				'commentaire': element.commentaire
			});
			commentsFormArray.push(commentGroup);
		});

    this.arForm.get('chantier_id').setValue(ar.chantier_id);
    this.arForm.get('a_prevoir_compagnons').setValue(ar.a_prevoir_compagnons+'');
		this.arForm.get('a_signer_registre_travaux').setValue(ar.a_signer_registre_travaux+'');
		this.arForm.get('a_prevoir_balisage').setValue(ar.a_prevoir_balisage+'');
  }
  
  getParams(){
    this.paramsService
      .getValues()
      .subscribe( async res => {
        this.params = res.result.data;
        this.createForm();
        this.setDynamicValidators();
        this.cdr.detectChanges();
        this.cdr.markForCheck();
      }); 
  }

  async getTypes(){
    var res = await this.typeService.getAllFromModel('Ar').toPromise();
    this.types = res.result.data;
    this.cdr.detectChanges();
    this.cdr.markForCheck();
  }

  async getUsers(){
    var res = await this.authService.getList().toPromise();
    this.users = res.result.data;
    this.cdr.detectChanges();
    this.cdr.markForCheck();
  }

  createForm() {
		this.arForm = this.arFB.group({
      chantier_id: [null, Validators.required],
      a_prevoir_compagnons:['0', Validators.required],
      date_accueil_secu:[null],
      realisateur:[''],
      tel_realisateur:[''],
      date_validite:[null],
			accueil_secu_days:[null],
			accueil_secu_time_opening:[''],
      accueil_secu_time_closing:[''],
      
      contact_interne_secours:[null, Validators.required],
      tel_contact_interne_secours:['', Validators.required],
      contact_client_chef_chtr:['', Validators.required],
      tel_contact_client_chef_chtr:['', Validators.required],
      contact_client_hse:['', Validators.required],
      tel_contact_client_hse:['', Validators.required],
      heure_ouverture:[this.params['heure_ouverture'], Validators.required],
      heure_fermeture:[this.params['heure_fermeture'], Validators.required],
      courant_dispo:[this.params['courant_dispo'], Validators.required],

      a_signer_registre_travaux:['0', Validators.required],
      registre_signing_period:['quotidiennement'],
      nom_charge_registre:[null],
      adresse_charge_registre:[''],
      ville_charge_registre:[null],
      pays_charge_registre:[null],
      codepostal_charge_registre:[''],
      tel_charge_registre:[''],

      a_prevoir_balisage:['0', Validators.required],

      observations_signature:[''],
      risques:new FormArray([]),
      equipements:new FormArray([]),
      zones:new FormArray([]),
      comments:new FormArray([]),
		});
		this.loaded = true;
		this.cdr.detectChanges();
  }

  setDynamicValidators() {
    const nom_charge_registre = this.arForm.get('nom_charge_registre');
    const adresse_charge_registre = this.arForm.get('adresse_charge_registre');
    const ville_charge_registre = this.arForm.get('ville_charge_registre');
    const pays_charge_registre = this.arForm.get('pays_charge_registre');
    const codepostal_charge_registre = this.arForm.get('codepostal_charge_registre');
    const tel_charge_registre = this.arForm.get('tel_charge_registre');

    const date_accueil_secu = this.arForm.get('date_accueil_secu');
    const realisateur = this.arForm.get('realisateur');
    const tel_realisateur = this.arForm.get('tel_realisateur');
    const date_validite = this.arForm.get('date_validite');
    const accueil_secu_days = this.arForm.get('accueil_secu_days');
    const accueil_secu_time_opening = this.arForm.get('accueil_secu_time_opening');
    const accueil_secu_time_closing = this.arForm.get('accueil_secu_time_closing');

    var contactsFields = [];
    contactsFields[0] = [
      {
        'name' : 'contact_interne_secours',
        'control' : this.arForm.get('contact_interne_secours')
      },
      {
        'name' : 'tel_contact_interne_secours',
        'control' : this.arForm.get('tel_contact_interne_secours')
      }
    ];
    contactsFields[1] = [
      {
        'name' : 'contact_client_chef_chtr',
        'control' : this.arForm.get('contact_client_chef_chtr')
      },
      {
        'name' : 'tel_contact_client_chef_chtr',
        'control' : this.arForm.get('tel_contact_client_chef_chtr')
      }
    ];
    contactsFields[2] = [
      {
        'name' : 'contact_client_hse',
        'control' : this.arForm.get('contact_client_hse')
      },
      {
        'name' : 'tel_contact_client_hse',
        'control' : this.arForm.get('tel_contact_client_hse')
      }
    ];

    contactsFields.forEach((item, index) => {
      this.arForm.get(item[0].name).valueChanges
      .pipe(distinctUntilChanged())  
      .subscribe(field => {

        if (field !== '') {
          contactsFields.forEach((element, key) => {
            if(key != index){
              element.forEach(control => {
                control.control.setValidators(null);
              });
            }
          });
        }

        if (field === '') {
          contactsFields.forEach((element, key) => {
            if(key != index){
              element.forEach(control => {
                control.control.setValidators([Validators.required]);
              });
            }
          });
        }

        contactsFields.forEach((element, key) => {
          if(key !== index){
            element.forEach(control => {
              control.control.updateValueAndValidity();
            });
          }
        });
      });
    });

    this.arForm.get('a_signer_registre_travaux').valueChanges
      .subscribe(a_signer_registre_travaux => {

        if (a_signer_registre_travaux === '1') {
          nom_charge_registre.setValidators([Validators.required]);
          adresse_charge_registre.setValidators([Validators.required]);
          ville_charge_registre.setValidators([Validators.required]);
          pays_charge_registre.setValidators([Validators.required]);
          codepostal_charge_registre.setValidators([Validators.required]);
          tel_charge_registre.setValidators([Validators.required]);
        }

        if (a_signer_registre_travaux === '0') {
          nom_charge_registre.setValidators(null);
          adresse_charge_registre.setValidators(null);
          ville_charge_registre.setValidators(null);
          pays_charge_registre.setValidators(null);
          codepostal_charge_registre.setValidators(null);
          tel_charge_registre.setValidators(null);
        }

        nom_charge_registre.updateValueAndValidity();
        adresse_charge_registre.updateValueAndValidity();
        ville_charge_registre.updateValueAndValidity();
        pays_charge_registre.updateValueAndValidity();
        codepostal_charge_registre.updateValueAndValidity();
        tel_charge_registre.updateValueAndValidity();
      });

    this.arForm.get('a_prevoir_compagnons').valueChanges
      .subscribe(a_prevoir_compagnons => {

        if (a_prevoir_compagnons === '1') {
          date_accueil_secu.setValidators([Validators.required]);
          realisateur.setValidators([Validators.required]);
          tel_realisateur.setValidators([Validators.required]);
          date_validite.setValidators([Validators.required]);
          accueil_secu_days.setValidators([Validators.required]);
          accueil_secu_time_opening.setValidators([Validators.required]);
          accueil_secu_time_closing.setValidators([Validators.required]);
        }

        if (a_prevoir_compagnons === '0') {
          date_accueil_secu.setValidators(null);
          realisateur.setValidators(null);
          tel_realisateur.setValidators(null);
          date_validite.setValidators(null);
          accueil_secu_days.setValidators(null);
          accueil_secu_time_opening.setValidators(null);
          accueil_secu_time_closing.setValidators(null);
        }

        date_accueil_secu.updateValueAndValidity();
        realisateur.updateValueAndValidity();
        tel_realisateur.updateValueAndValidity();
        date_validite.updateValueAndValidity();
        accueil_secu_days.updateValueAndValidity();
        accueil_secu_time_opening.updateValueAndValidity();
        accueil_secu_time_closing.updateValueAndValidity();
      });
  }
  
  async onSubmit(event){

    try {
      this.formStatus.onFormSubmitting();
      let form = {...this.arForm.value};

      if(form.chantier_id)
      {
        if(!this.chantier.is_all_ars_archived){
          this.fireNotifBeforeSave(
            form,
            'Une autre analyse de risque est disponible et va être archivée.'
          );
        }else{
          this.save(form);
        }

      }else{
        Swal.fire({
          icon: 'error',
          title: 'Echec! Veuillez sélectionner un chantier',
          showConfirmButton: false,
          timer: 2000
        });
      }

    } catch (error) {
      console.error(error);
      throw error;
    }

  }

  fireNotifBeforeSave(form, message){
    Swal.fire({
      icon: 'warning',
      title: 'Voulez vous vraiment créer une nouvelle analyse de risque ?',
      text: message,
      showConfirmButton: true,
      showCancelButton: true,
      cancelButtonText: 'Annuler',
      confirmButtonText: 'Confirmer'
    }).then(async response => {
      if (response.value) {
        try {
          this.save(form);
        } catch (e) {
          console.log(e);
          Swal.fire({
            icon: 'error',
            title: 'Echec! une erreur est survenue',
            showConfirmButton: false,
            timer: 1500
          });
        }
      }
    });
  }

  fireNotifAfterSave(message = null){
    Swal.fire({
      icon: 'success',
      title: 'Analyse de risque créée avec succès',
      text: message,
      showConfirmButton: false,
      timer: 2000
    }).then(() => {
      this.router.navigate(['/analyses-risque/list']);
    });
  }

  async save(form){
    form.date_accueil_secu = this.dateFrToEnPipe.transform(form.date_accueil_secu);
    form.date_validite = this.dateFrToEnPipe.transform(form.date_validite);

    this.arService.create(form)
      .toPromise()
      .then((ar) => {
        console.log(ar);
        this.cdr.markForCheck();

        var message = null;
        if(!this.chantier.is_all_ars_signed){
          message = 'Une analyse de risque sans signature a été archivée.';
        }
        this.fireNotifAfterSave(message);
  
      })
      .catch(err =>{ 

        Swal.fire({
          icon: 'error',
          title: 'Echec! le formulaire est incomplet',
          showConfirmButton: false,
          timer: 2000
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
  }

  getChantier(chantier: Chantier): void{
    if(chantier){
      this.chantier = chantier;
    }
  }

  isLastStep(isLastStep: boolean): void{
    if(isLastStep){
      this.enableBtn = true;
    }
  }

}
