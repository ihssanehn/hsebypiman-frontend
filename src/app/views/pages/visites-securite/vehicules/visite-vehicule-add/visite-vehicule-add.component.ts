import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from "@angular/forms";
import { Location } from '@angular/common';
import moment from 'moment';

import { TranslateService } from '@ngx-translate/core';
import { VisiteVehiculeService, CatQuestionService } from '@app/core/services';
import { VisiteVehicule, Vehicule, CatQuestion } from '@app/core/models';
import { AuthService, User } from '@app/core/auth';
import { MatSnackBar } from '@angular/material';
import Swal from 'sweetalert2';
import {extractErrorMessagesFromErrorResponse} from '@app/core/_base/crud';
import {FormStatus} from '@app/core/_base/crud/models/form-status';
import { DateFrToEnPipe, DateEnToFrPipe } from '@app/core/_base/layout';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'tf-visite-vehicule-add',
  templateUrl: './visite-vehicule-add.component.html',
  styleUrls: ['./visite-vehicule-add.component.scss']
})
export class VisiteVehiculeAddComponent implements OnInit {
  
  visite: VisiteVehicule;
  visiteForm: FormGroup;
  catQuestionsList: CatQuestion[];
	// allRoles: Role[];
  formStatus = new FormStatus();
  loaded = false;
  invalid = [];
  editMode: boolean = false;
  vehicule: Vehicule;
  currentUser: User;
  questionsDisplayed: boolean = false;
  showSignatures: boolean = false;
  formloading: boolean = false;
  // Private properties
  
  constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private visiteFB: FormBuilder,
		// private notificationService: NzNotificationService,
		private visiteService: VisiteVehiculeService,
    private catQuestionService: CatQuestionService,
    private location: Location,
    private authService:AuthService,
    private cdr: ChangeDetectorRef,
    public snackBar: MatSnackBar,
    private dateFrToEnPipe:DateFrToEnPipe,
    private dateEnToFrPipe:DateEnToFrPipe,
    private translate: TranslateService
  ) {
		this.authService.currentUser.subscribe(x=> this.currentUser = x);
   }

  ngOnInit() {
    const routeSubscription = this.activatedRoute.queryParams
    .subscribe(
      async params => {
        const id = params.visite_id;
        if(id){
          this.visiteService
          .get(id)
          .pipe(
            tap(
              vs => {
                var _vs = vs.result.data;
                this.patchVsDatas(_vs);
              }
            )
         )
          .subscribe( async res => {
            this.visite = res.result.data;
            this.loaded = true;
            this.cdr.markForCheck();
          });
        }else{
          this.visite = new VisiteVehicule();
        }
    });

    this.createForm();    
    //this.setDynamicValidators();
  }

  patchVsDatas(_vs){
    this.visiteForm.get('salarie_id').setValue(_vs.salarie_id);
    this.visiteForm.get('visitable_id').setValue(_vs.visitable_id);
    this.visiteForm.get('is_externe').setValue(_vs.is_externe);
    this.visiteForm.get('redacteur_id').setValue(_vs.redacteur_id);
    this.visiteForm.get('etat_id').setValue(_vs.etat_id);
    this.visiteForm.get('presence_non_conformite').setValue(_vs.presence_non_conformite);
    this.visiteForm.get('has_rectification_imm').setValue(_vs.has_rectification_imm);
    this.visiteForm.get('avertissement').setValue(_vs.avertissement);
    this.visiteForm.get('type_id').setValue(_vs.type_id);
  }
  createForm() {
		this.visiteForm = this.visiteFB.group({
      'salarie_id': [{value:null, disabled:false}],
      'visitable_id': [{value:null, disabled:false}, Validators.required],
      'is_externe' : [{value : 0, disabled : false},Validators.required],
      //'entreprise_id': [{value:null, disabled:false}, Validators.required],
      'redacteur_id': [{value:this.currentUser.id, disabled:true}, Validators.required],
      'etat_id': [{ value: null, disabled: false }, Validators.required],
      'date_visite': [moment().format('DD/MM/YYYY'), Validators.required],
      'presence_non_conformite': [{value:false, disabled: true}],
      'has_rectification_imm': [{value:false, disabled: true}],
      'avertissement': [{value:false, disabled: false}],
      'type_id': [null, Validators.required],
      'questions': this.visiteFB.array([]),
      'catQuestionsList' : this.visiteFB.array([]),
      'vehicule_km': [null, Validators.required],
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
      'img_canvas': [{value:null, disabled:true}]
		});
    this.setDynamicForm();
		this.loaded = true;
  }

  setDynamicForm(){
    // this.visiteForm.get('salarie_id').valueChanges.subscribe(salarie_id=>{
      
    //   this.visiteForm.get('visitable_id').setValue(null);
    //   if(salarie_id){
    //     this.visiteForm.get('visitable_id').enable();
    //   }else{
    //     this.visiteForm.get('visitable_id').disable();
    //   }
    // })

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

  

  async onUserSelected(form){
    this.visiteForm.patchValue(form);
    this.displayQuestions();
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
            this.router.navigate(['/visites-securite/vehicules/list']);
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

  cantDisplayQuestions(){
    var test: boolean = this.visiteForm.get('vehicule').invalid ||
      this.visiteForm.get('type_id').invalid ||
      this.visiteForm.get('salarie_id').invalid;
     // || this.visiteForm.get('entreprise_id').invalid;

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

  inVisite(quest_id){
    return this.visite.questions.filter(x=>x.id==quest_id).length > 0;
  }

  parseQuestions(item){
    if(item.length > 0){

      const catQuestionsListFormArray: FormArray = this.visiteForm.get('catQuestionsList') as FormArray;
      item.forEach((element, i) => {
        let questionsArrayFB = []

        element.questions.forEach(quest => {
          if(this.visite.id && this.inVisite(quest.id)){
            var toPatch = this.visite.questions.filter(x=>x.id==quest.id)[0];
            var question = this.visiteFB.group({
              'id': [quest.id],
              'libelle': [quest.libelle],
              'pivot': this.visiteFB.group({
                'note':[{value:toPatch.pivot.note, disabled:false}, Validators.required],
                'date_remise_conf':[{value:this.dateEnToFrPipe.transform(toPatch.pivot.date_visite), disabled:false}],
                'observation':[{value:toPatch.pivot.observation, disabled:false}],
                'action_to_visited': [{value: toPatch.pivot.action_to_visited, disabled:true}]
              })
            });
          }else{
            var question = this.visiteFB.group({
              'id': [quest.id],
              'libelle': [quest.libelle],
              'pivot': this.visiteFB.group({
                'note':[{value:null, disabled:false}, Validators.required],
                'date_remise_conf':[{value:null, disabled:false}],
                'observation':[{value:'', disabled:false}],
                'action_to_visited': [{value: 0, disabled: true}]
              })
            });
          }

         this.setPivotRules(question);

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
  }

 
  setPivotRules(question){
    const pivot = question.get('pivot') as FormGroup;
    const note = pivot.get('note') as FormControl;
    const date_remise_conf = pivot.get('date_remise_conf') as FormControl;
    const action_to_visited = pivot.get('action_to_visited') as FormControl;
    const salarie_id = this.visiteForm.get('salarie_id');

    salarie_id.valueChanges.subscribe(salarie_id=>{
      if(salarie_id){
        if(note.value ==2){
          action_to_visited.enable();
        }
      }else{
        action_to_visited.disable({emitEvent:false, onlySelf:true});
      }
    });

    note.valueChanges.subscribe(note=>{
      if(note == 2){
        date_remise_conf.enable({emitEvent:false, onlySelf:true})
        if(salarie_id.value){
          action_to_visited.enable({emitEvent:false, onlySelf:true})
        }
        this.visiteForm.get('presence_non_conformite').setValue(true);
      }else{
        date_remise_conf.disable({emitEvent:false, onlySelf:true})
        date_remise_conf.setValue(null);
        action_to_visited.disable({emitEvent:false, onlySelf:true})
        action_to_visited.setValue(0);
        var nbr_ko = this.getNotes().ko;
        if(nbr_ko == 0 && this.visiteForm.get('presence_non_conformite').value == true){
          this.visiteForm.get('presence_non_conformite').setValue(false);
        }
      } 
    })

    date_remise_conf.valueChanges.subscribe(date=>{
      if(date){
        action_to_visited.disable({emitEvent:false, onlySelf:true})
        action_to_visited.setValue(0);
      }else{
        if(salarie_id.value){
          action_to_visited.enable({emitEvent:false, onlySelf:true})
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
  }

  getNotes(){
    const test = this.visiteForm.get('catQuestionsList').value
    var questions = test.reduce((prev, curr)=> prev.concat(curr.questions), []);
    
    var ok = questions.filter(x => x.pivot.note == 1).length
    var ko = questions.filter(x => x.pivot.note == 2).length
    var ko_unsolved = questions.filter(x => x.pivot.note == 2 && !x.pivot.date_remise_conf).length
    var ko_solved = questions.filter(x => x.pivot.note == 2 && x.pivot.date_remise_conf).length
    var so = questions.filter(x => x.pivot.note == 3).length
    var total = questions.length;
    return { 'ok': ok, 'ko': ko, 'so': so, 'ko_unsolved': ko_unsolved, 'ko_solved': ko_solved, 'total': total };
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
    return this.visiteForm.get('catQuestionsList').value.length > 0
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
    return questionsList.value.length > 0 && questionsList.valid
  }  

  displaySignature(){
    this.showSignatures = !this.showSignatures
  }
}
