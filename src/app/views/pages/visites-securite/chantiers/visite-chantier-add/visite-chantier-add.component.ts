import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from "@angular/forms";
import { CommonModule, Location } from '@angular/common';
import * as moment from 'moment';

import { TranslateService } from '@ngx-translate/core';
import { VisiteChantierService, TypeService, ChantierService, CatQuestionService } from '@app/core/services';
import { VisiteChantier, Type, Chantier, CatQuestion } from '@app/core/models';
import { NgxPermissionsService } from 'ngx-permissions';
import { AuthService, User } from '@app/core/auth';
import { MatSnackBar } from '@angular/material';
import Swal from 'sweetalert2';
import { finalize, takeUntil, tap } from 'rxjs/operators';
import {extractErrorMessagesFromErrorResponse} from '@app/core/_base/crud';
import {FormStatus} from '@app/core/_base/crud/models/form-status';
import { DateFrToEnPipe } from '@app/core/_base/layout';

@Component({
  selector: 'tf-visite-chantier-add',
  templateUrl: './visite-chantier-add.component.html',
  styleUrls: ['./visite-chantier-add.component.scss']
})
export class VisiteChantierAddComponent implements OnInit {
  
  visite: VisiteChantier;
  visiteForm: FormGroup;
  catQuestionsList: CatQuestion[];
	// allRoles: Role[];
  formStatus = new FormStatus();
  loaded = false;
  invalid = [];
  formloading: boolean = false;
  editMode: boolean = false;
  chantier: Chantier;
  currentUser: User;
  questionsDisplayed: boolean = false;
  showSignatures: boolean = false;
  // Private properties
  
  constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private visiteFB: FormBuilder,
		// private notificationService: NzNotificationService,
		private visiteService: VisiteChantierService,
    private chantierService: ChantierService,
    private catQuestionService: CatQuestionService,
    private location: Location,
    private authService:AuthService,
    private cdr: ChangeDetectorRef,
    public snackBar: MatSnackBar,
    private dateFrToEnPipe:DateFrToEnPipe
  ) { }

  ngOnInit() {
    this.visite = new VisiteChantier();
    this.createForm();    
    this.setDynamicValidators();
    this.getCurrentUser();
  }

	async getCurrentUser() {
		var res = await this.authService.getUserByToken().toPromise().then(res=>{this.visiteForm.get('redacteur_id').setValue(res.result.data.id)});
		this.cdr.detectChanges();
  }
  
  createForm() {
		this.visiteForm = this.visiteFB.group({
      'chantier_id': ['', Validators.required],
      'chantier': [''],
      'salarie_id': [{value:null, disabled:false}, Validators.required],
      'entreprise_id': [{value:null, disabled:false}, Validators.required],
      'redacteur_id': [{value:null, disabled:true}, Validators.required],
      'date_visite': [moment().format('DD/MM/YYYY'), Validators.required],
      // 'is_validated_redacteur': ['', Validators.required],
      // 'is_validated_visite': ['', Validators.required],
      // 'validated_redacteur_at': ['', Validators.required],
      // 'validated_visite_at': ['', Validators.required],
      'presence_non_conformite': [{value:false, disabled: true}],
      'has_rectification_imm': [{value:false, disabled: true}],
      'avertissement': [{value:false, disabled: false}],
      'type_id': [null, Validators.required],
      'questions': this.visiteFB.array([]),
      'signature_redacteur': this.visiteFB.group({
        'date':[null, Validators.required],
        'signature': [null, Validators.required]
      }),
      'signature_visite': this.visiteFB.group({
        'date':[null, Validators.required],
        'signature': [null, Validators.required]
      }),
      'signature_resp_hse': this.visiteFB.group({
        'date':[{value:null, disabled:true}],
        'signature': [{value:null, disabled:true}]
      }),
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
      this.formloading = true;
      let form = {...this.visiteForm.getRawValue()};
      this.formStatus.onFormSubmitting();
      this.parseDates(form);

      this.visiteService.create(form)
        .toPromise()
        .then((visite) => {
          this.formloading = false;
          this.cdr.markForCheck();
          
          Swal.fire({
            icon: 'success',
            title: 'Visite créée avec succès',
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            this.router.navigate(['/visites-securite/chantiers/list']);
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
            this.cdr.detectChanges();
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

  cantDisplayQuestions(){
    var test: boolean = this.visiteForm.get('chantier_id').invalid ||
      this.visiteForm.get('type_id').invalid ||
      this.visiteForm.get('salarie_id').invalid || 
      this.visiteForm.get('entreprise_id').invalid;

    return test;
  }  

  async displayQuestions(){
    var params = {
      type_id: this.visiteForm.get('type_id').value,
      paginate:false
    }
    await this.catQuestionService.getAll(params).pipe(
      tap(res=>{
        this.catQuestionsList = res.result.data;
        this.parseQuestions(res.result.data);

      })
    ).subscribe(res=>{
      this.questionsDisplayed = true;
      this.visiteForm.get('type_id').disable();
      this.cdr.markForCheck();

    });
  }

  parseQuestions(item){
    if(item.length > 0){
      const questionFormArray = this.visiteForm.get('questions') as FormArray

      for (let i = 0; i < item.length; i++) {
        const catQ = item[i]; 
        for (let j = 0; j < catQ.questions.length; j++) {
          const q = catQ.questions[j];
          const question = this.visiteFB.group({
            'id': [q.id],
            'libelle': [q.libelle],
            'pivot': this.visiteFB.group({
              'note':[{value:null, disabled:false}, Validators.required],
              'date_remise_conf':[{value:null, disabled:false}],
              'observation':[{value:'', disabled:false}]
            })
          })

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
              var nbr_ko = this.getNotes().ko;
              if(nbr_ko == 0 && this.visiteForm.get('presence_non_conformite').value == true){
                this.visiteForm.get('presence_non_conformite').setValue(false);
              }
            }
          })

          pivot.valueChanges.subscribe(pivot=>{
            var nbr_ko_unsolved = this.getNotes().ko_unsolved;
            if(nbr_ko_unsolved > 0){
              this.visiteForm.get('has_rectification_imm').setValue(true)
            }else{
              this.visiteForm.get('has_rectification_imm').setValue(false);
            }
          })

          questionFormArray.push(question)
        }
      }
    }
  }


  parseDates(form){
    form.date_visite = this.dateFrToEnPipe.transform(form.date_visite);
    form.questions.forEach(x=>{
      x.pivot.date_remise_conf = this.dateFrToEnPipe.transform(x.pivot.date_remise_conf);
    })
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

  questionsAnswerd(){
    const questionsList = this.visiteForm.get('questions');
    return questionsList.value.length > 0 && questionsList.valid
  }  

  displaySignature(){
    this.showSignatures = !this.showSignatures
  }

  getNotes(){
    const test = this.visiteForm.get('questions').value;
    var ok = test.filter(x=>x.pivot.note == 1).length
    var ko = test.filter(x=>x.pivot.note == 2).length
    var ko_unsolved = test.filter(x=>x.pivot.note == 2 && !x.pivot.date_remise_conf).length
    var ko_solved = test.filter(x=>x.pivot.note == 2 && x.pivot.date_remise_conf).length
    var so = test.filter(x=>x.pivot.note == 3).length
    var total = test.length;
    return {'ok':ok, 'ko':ko, 'so':so, 'ko_unsolved':ko_unsolved, 'ko_solved':ko_solved, 'total':total};
  }

}
