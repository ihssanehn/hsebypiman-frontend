import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from "@angular/forms";
import { CommonModule, Location } from '@angular/common';
import moment from 'moment';

import { TranslateService } from '@ngx-translate/core';
import { VisiteOutillageService, TypeService, OutillageService, CatQuestionService } from '@app/core/services';
import { VisiteOutillage, Type, Outillage, CatQuestion } from '@app/core/models';
import { NgxPermissionsService } from 'ngx-permissions';
import { AuthService, User } from '@app/core/auth';
import { MatSnackBar } from '@angular/material';
import Swal from 'sweetalert2';
import {extractErrorMessagesFromErrorResponse} from '@app/core/_base/crud';
import {FormStatus} from '@app/core/_base/crud/models/form-status';
import { DateFrToEnPipe } from '@app/core/_base/layout';

@Component({
  selector: 'tf-visite-outillage-add',
  templateUrl: './visite-outillage-add.component.html',
  styleUrls: ['./visite-outillage-add.component.scss']
})
export class VisiteOutillageAddComponent implements OnInit {
  
  visite: VisiteOutillage;
  visiteForm: FormGroup;
	// allRoles: Role[];
  formStatus = new FormStatus();
  loaded = false;
  invalid = [];
  formloading: boolean = false;
  editMode: boolean = false;
  outillage: Outillage;
  currentUser: User;
  questionsDisplayed: boolean = false;
  showSignatures: boolean = false;
  catQuestionsList: CatQuestion[];
  // Private properties
  
  constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private visiteFB: FormBuilder,
		// private notificationService: NzNotificationService,
		private visiteService: VisiteOutillageService,
    private outillageService: OutillageService,
    private catQuestionsService : CatQuestionService,
    private translate: TranslateService,
    private location: Location,
    private authService:AuthService,
    private cdr: ChangeDetectorRef,
    public snackBar: MatSnackBar,
    private dateFrToEnPipe:DateFrToEnPipe
  ) { 
    this.authService.currentUser.subscribe(x=> this.currentUser = x);
  }

  ngOnInit() {
    this.visite = new VisiteOutillage();
    this.createForm();    
  }

  async getQuestions(){
    this.catQuestionsList = (await this.catQuestionsService.getAll({type_id : this.visiteForm.get('type_id').value}).toPromise()).result.data;
    this.patchQuestionsForm();
  }
  
  createForm() {
		this.visiteForm = this.visiteFB.group({
      'outillage_code': ['', Validators.required],
      'visitable_id': [{value : null, disabled : true}, Validators.required],
      'code' : [{value : null, disabled : false},Validators.required],
      'is_externe' : [{value : 0, disabled : false},Validators.required],
      'salarie_id': [{value:null, disabled:false}, Validators.required],
      'catQuestionsList' : this.visiteFB.array([]),
      'entreprise_id': [{value:null, disabled:false}, Validators.required],
      'redacteur_id': [{value:this.currentUser.id, disabled:true}, Validators.required],
      'date_visite': [moment().format('DD/MM/YYYY'), Validators.required],
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
    
    this.setDynamicForm();
    this.loaded = true;
  }
  
 setDynamicForm(){
    this.visiteForm.get('salarie_id').valueChanges.subscribe(salarie_id=>{
      this.visiteForm.get('visitable_id').setValue(null);
        if(salarie_id){
        this.visiteForm.get('visitable_id').enable();
      }else{
        this.visiteForm.get('visitable_id').disable();
      }
    })
    
    // this.visiteForm.get('is_externe').valueChanges.subscribe(is_externe=>{
    //   if(is_externe){
    //     this.visiteForm.get('type_id').disable();
    //     this.visiteForm.get('type_id').setValidators(null);
    //     this.visiteForm.get('type_id').setValue(null);
    //   }else{
    //     this.visiteForm.get('type_id').enable();
    //     this.visiteForm.get('type_id').setValidators([Validators.required]);
    //   }
    // })
  }

  patchQuestionsForm() {
		
		const catQuestionsListFormArray: FormArray = this.visiteForm.get('catQuestionsList') as FormArray;
		this.catQuestionsList.forEach((element, i) => {
			let questionsArrayFB = []
			element.questions.forEach(quest => {
				var question = this.visiteFB.group({
					'id': [quest.id],
					'libelle': [quest.libelle],
					'pivot': this.visiteFB.group({
						'note': [null, Validators.required],
						'date_remise_conf': [null],
						'observation': [''],
            'action_to_visited': [0]
					})
        });
        
        this.setPivotRules(question)
				questionsArrayFB.push(question);			
			})
			var cat = this.visiteFB.group({
				'id': [element.id],
				'libelle': [element.libelle],
				'code': [ element.code],
				'questions': this.visiteFB.array(questionsArrayFB)
      })
			catQuestionsListFormArray.push(cat);
    })
  }
  
  setPivotRules(question){
    const pivot = question.get('pivot') as FormGroup;
    const note = pivot.get('note') as FormControl;
    const date_remise_conf = pivot.get('date_remise_conf') as FormControl;
    const action_to_visited = pivot.get('action_to_visited') as FormControl;

    note.valueChanges.subscribe(note=>{
      if(note == 2){
        date_remise_conf.enable({emitEvent:false, onlySelf:true})
        action_to_visited.enable({emitEvent:false, onlySelf:true})
      }else{
        date_remise_conf.disable({emitEvent:false, onlySelf:true})
        date_remise_conf.setValue(null);
        action_to_visited.disable({emitEvent:false, onlySelf:true})
        action_to_visited.setValue(0);
      }      
    })
    date_remise_conf.valueChanges.subscribe(date=>{
      if(date){
        action_to_visited.disable({emitEvent:false, onlySelf:true})
        action_to_visited.setValue(0);
      }else{
        action_to_visited.enable({emitEvent:false, onlySelf:true})
      }
    })
  }

  async onUserSelected(form){
    // this.visiteForm.get('outillage_code').setValue(form.get('outillage_code'));
    this.visiteForm.patchValue(form);

    await this.getQuestions();
    this.displayQuestions();
    console.log(this.questionsDisplayed);
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
          this.cdr.markForCheck();
          
          this.formloading = false;
          Swal.fire({
            icon: 'success',
            title: this.translate.instant("VISITES.NOTIF.VISIT_CREATED.TITLE"),
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            this.router.navigate(['/visites-securite/outillages/list']);
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

 

  displayQuestions(){
    this.questionsDisplayed = true;
    this.visiteForm.get('type_id').disable();
  }

  parseDates(form){
    form.date_visite = this.dateFrToEnPipe.transform(form.date_visite);
    form.catQuestionsList.forEach(cat=>{
      cat.questions.forEach(x=>{
        x.pivot.date_remise_conf = this.dateFrToEnPipe.transform(x.pivot.date_remise_conf);
      })
    })
  }

  onCancel() {
		this.location.back();
  }

  questionsLoaded(){
    return this.visiteForm.get('catQuestionsList').value.length > 0;
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
    const questionsList = this.visiteForm.get('catQuestionsList');
    return questionsList.value.length > 0 && !questionsList.invalid
  }  

  displaySignature(){
    this.showSignatures = !this.showSignatures
  }
}
