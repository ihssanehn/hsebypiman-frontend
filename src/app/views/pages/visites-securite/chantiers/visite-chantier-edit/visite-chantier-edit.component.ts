import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from "@angular/forms";
import { Location } from '@angular/common';
import * as moment from 'moment';
import { Subscription } from "rxjs";
import { tap } from 'rxjs/operators';

import { VisiteChantierService, ChantierService} from '@app/core/services';
import { VisiteChantier, Chantier } from '@app/core/models';
import { AuthService, User } from '@app/core/auth';
import { MatSnackBar } from '@angular/material';
import Swal from 'sweetalert2';
import {extractErrorMessagesFromErrorResponse} from '@app/core/_base/crud';
import {FormStatus} from '@app/core/_base/crud/models/form-status';
import { DateFrToEnPipe , DateEnToFrPipe} from '@app/core/_base/layout';

@Component({
  selector: 'tf-visite-chantier-edit',
  templateUrl: './visite-chantier-edit.component.html',
  styleUrls: ['./visite-chantier-edit.component.scss']
})
export class VisiteChantierEditComponent implements OnInit, OnDestroy {
  
  public visite: VisiteChantier;
  visiteForm: FormGroup;
	// allRoles: Role[];
  formStatus = new FormStatus();
  loaded = false;
  invalid = [];
  editMode: boolean = false;
  chantier: Chantier;
  currentUser: User;
  questionsDisplayed: boolean = false;
	private subscriptions: Subscription[] = [];

  // Private properties
  
  constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private visiteFB: FormBuilder,
		// private notificationService: NzNotificationService,
		private visiteService: VisiteChantierService,
    private chantierService: ChantierService,
    private location: Location,
    private authService:AuthService,
    private cdr: ChangeDetectorRef,
    public snackBar: MatSnackBar,
    private dateFrToEnPipe:DateFrToEnPipe,
    private dateEnToFrPipe:DateEnToFrPipe
  ) { }

  ngOnInit() {
    this.createForm();    
    this.setDynamicValidators();
	
    const routeSubscription = this.activatedRoute.params.subscribe(
      async params => {
        const id = params.id;
        if (id) {
          this.visiteService.get(id).pipe(
            tap(res=>{
              var _visite = res.result.data
              this.parseVisitesDate(_visite, 'EnToFr');
              this.visiteForm.patchValue(_visite);
              this.formPathValues(_visite);
              
            })
          ).subscribe( async res => {
            this.visite = res.result.data;
            this.loaded = true;
            this.cdr.detectChanges();
            this.cdr.markForCheck();
          });

        } else {
          this.router.navigateByUrl('/chantiers/list');
        }
      });

    this.subscriptions.push(routeSubscription);
    this.getCurrentUser();

  }

  ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}
	async getCurrentUser() {
		var res = await this.authService.getUserByToken().toPromise().then(res=>{this.visiteForm.get('redacteur_id').setValue(res.result.data.id)});
		this.cdr.detectChanges();
  }
  
  createForm() {
		this.visiteForm = this.visiteFB.group({
      'id': [{value:null, disabled:true}, Validators.required],
      'code': [{value:null, disabled:true}],
      'chantier_id': [null, Validators.required],
			'chantier': [''],
      'salarie_id': [{value:null, disabled:false}, Validators.required],
      'entreprise_id': [{value:null, disabled:false}, Validators.required],
      'redacteur_id': [{value:null, disabled:true}, Validators.required],
      'date_visite': [moment().format('YYYY-MM-DD'), Validators.required],
      'presence_non_conformite': [{value:false, disabled: true}],
      'has_rectification_imm': [{value:false, disabled: false}],
      'avertissement': [{value:false, disabled: false}],
      'type_id': [null, Validators.required],
      'questions': this.visiteFB.array([]),
		});
		this.loaded = true;
		this.cdr.detectChanges();
  	}
  
  parseVisitesDate(item, direction){
    item.date_visite = direction == 'FrToEn' ? this.dateFrToEnPipe.transform(item.date_visite) : this.dateEnToFrPipe.transform(item.date_visite);
    if(item.questions.length > 0){
      item.questions.forEach(x=>{
        x.pivot.date_remise_conf = direction == 'FrToEn' ? this.dateFrToEnPipe.transform(x.pivot.date_remise_conf) : this.dateEnToFrPipe.transform(x.pivot.date_remise_conf);
      })
    }
  }

  formPathValues(visite){
		
		const questionsFormArray: FormArray = this.visiteForm.get('questions') as FormArray;
		visite.questions.forEach(element =>{
			var question = this.visiteFB.group({
				'id': [element.id],
        'libelle': [element.libelle],
        'pivot': this.visiteFB.group({
          'note':[{value:null, disabled:false}, Validators.required],
          'date_remise_conf':[{value:element.pivot.date_remise_conf, disabled:false}],
          'observation':[{value:element.pivot.observation, disabled:false}]
        })

      });
      const pivot = question.get('pivot') as FormGroup;
      const note = pivot.get('note') as FormControl;
      const date_remise_conf = pivot.get('date_remise_conf') as FormControl;

      note.valueChanges.subscribe(note=>{
        if(note == 2){
          date_remise_conf.enable({emitEvent:false, onlySelf:true})
          this.visiteForm.get('presence_non_conformite').setValue(true);
        }else{
          date_remise_conf.disable({emitEvent:false, onlySelf:true})
          date_remise_conf.setValue(null);
          this.visiteForm.get('questions').value.filter(x=>x.pivot.note == 2).length;
          if(this.visiteForm.get('questions').value.filter(x=>x.pivot.note == 2).length == 0 && this.visiteForm.get('presence_non_conformite').value == true){
            this.visiteForm.get('presence_non_conformite').setValue(false);
          }
        }
      })

      note.setValue(element.pivot.note);

      questionsFormArray.push(question);
    })

  }
  
  setDynamicValidators() {
    const salarie_id = this.visiteForm.get('salarie_id');
    const entreprise_id = this.visiteForm.get('entreprise_id');

    this.visiteForm.get('salarie_id').valueChanges.subscribe(salarie_id => {
        if (salarie_id != null) {
          entreprise_id.setValidators(null);
          entreprise_id.disable({onlySelf:true, emitEvent:false});
        }else{
          entreprise_id.setValidators(Validators.required);
          entreprise_id.enable({onlySelf:true, emitEvent:false});
        }
      })
      this.visiteForm.get('entreprise_id').valueChanges.subscribe(entreprise_id => {
        if (entreprise_id != null) {
          salarie_id.setValidators(null);
          salarie_id.disable({onlySelf:true, emitEvent:false});
        }else{
          salarie_id.setValidators(Validators.required);
          salarie_id.enable({onlySelf:true, emitEvent:false});
        }
    })
  }

  onChantierSelected(chantierId: Number) {
    this.getChantier(chantierId);
  }

  async getChantier(chantierId){
    var res = await this.chantierService.get(chantierId).toPromise();
    this.chantier = res.result.data;
  }

  async onSubmit(event){
    try {
      let form = {...this.visiteForm.getRawValue()};
      this.formStatus.onFormSubmitting();
      this.parseVisitesDate(form, 'FrToEn');

      this.visiteService.update(form)
        .toPromise()
        .then((visite) => {
          this.cdr.markForCheck();
          
          Swal.fire({
            icon: 'success',
            title: 'Visite mise à jour avec succès',
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            this.location.back();
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

  cantDisplayQuestions(){
    var test: boolean = this.visiteForm.get('chantier_id').invalid ||
      this.visiteForm.get('type_id').invalid ||
      this.visiteForm.get('salarie_id').invalid || 
      this.visiteForm.get('entreprise_id').invalid;

    return test;
  }  

  displayQuestions(){
    this.questionsDisplayed = true;
  }

  onCancel() {
		this.location.back();
  }

  questionsLoaded(){
    return this.visiteForm.get('questions').value.length > 0
  }

  public findInvalidControls() {
    const questions = this.visiteForm.controls.questions as FormGroup;
    const controls = questions.controls;
    const invalid = [];
    for (const name in controls) {
        if (controls[name].invalid) {
            invalid.push(name, controls[name].value);
        }
      }
      return invalid;
  }
  
}
