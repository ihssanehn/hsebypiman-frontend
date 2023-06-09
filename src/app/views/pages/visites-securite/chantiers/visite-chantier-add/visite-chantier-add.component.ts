import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from "@angular/forms";
import { Location } from '@angular/common';
import moment from 'moment';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { VisiteChantierService, ChantierService, CatQuestionService } from '@app/core/services';
import { VisiteChantier, Chantier, CatQuestion } from '@app/core/models';
import { AuthService, User } from '@app/core/auth';
import { MatSnackBar } from '@angular/material';
import Swal from 'sweetalert2';
import { tap } from 'rxjs/operators';
import {extractErrorMessagesFromErrorResponse} from '@app/core/_base/crud';
import {FormStatus} from '@app/core/_base/crud/models/form-status';
import { DateFrToEnPipe, DateEnToFrPipe } from '@app/core/_base/layout';

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
  
  // Private properties
  private subscriptions: Subscription[] = [];

  constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private visiteFB: FormBuilder,
		// private notificationService: NzNotificationService,
		private visiteService: VisiteChantierService,
    private chantierService: ChantierService,
    private catQuestionService: CatQuestionService,
    private translate: TranslateService,
    private location: Location,
    private authService:AuthService,
    private cdr: ChangeDetectorRef,
    public snackBar: MatSnackBar,
    private dateEnToFrPipe:DateEnToFrPipe,
    private dateFrToEnPipe:DateFrToEnPipe,
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
                this.createForm();    
                this.setDynamicValidators();

                var _vs = {
                  chantier_id: vs.result.data.visitable_id,
                  chantier: vs.result.data.chantier,
                  visitable_id: vs.result.data.visitable_id,
                  salarie_id: vs.result.data.salarie_id,
                  entreprise_id: vs.result.data.entreprise_id,
                  interimaire_id: vs.result.data.interimaire_id,
                  nom_prenom: vs.result.data.nom_prenom,
                  redacteur_id: vs.result.data.redacteur_id,
                  presence_non_conformite: vs.result.data.presence_non_conformite,
                  has_rectification_imm: vs.result.data.has_rectification_imm,
                  avertissement: vs.result.data.avertissement,
                  type_id: vs.result.data.type_id,
                };
                this.visiteForm.patchValue(_vs);
                this.cdr.markForCheck();
                this.chantier = _vs.chantier;
              }
            )
          )
          .subscribe( async res => {

            this.visite = res.result.data;
            this.loaded = true;
            this.displayQuestions();
            this.cdr.markForCheck();
          });
        }else{

          this.createForm();    
          this.setDynamicValidators();
          this.loaded = true;
          this.visite = new VisiteChantier();
        }
    });

    this.subscriptions.push(routeSubscription);
  }

  ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}


  patchVsDatas(_vs){
    this.visiteForm.get('chantier_id').setValue(_vs.visitable_id);
    this.visiteForm.get('visitable_id').setValue(_vs.visitable_id);
    this.visiteForm.get('salarie_id').setValue(_vs.salarie_id, {onlySelf:true, emitEvent:true});
    this.visiteForm.get('entreprise_id').setValue(_vs.entreprise_id);
    this.visiteForm.get('interimaire_id').setValue(_vs.interimaire_id);
    this.visiteForm.get('nom_prenom').setValue(_vs.nom_prenom);
    this.visiteForm.get('redacteur_id').setValue(_vs.redacteur_id);
    this.visiteForm.get('presence_non_conformite').setValue(_vs.presence_non_conformite);
    this.visiteForm.get('has_rectification_imm').setValue(_vs.has_rectification_imm);
    this.visiteForm.get('avertissement').setValue(_vs.avertissement);
    this.visiteForm.get('type_id').setValue(_vs.type_id);
  }

  createForm() {
		this.visiteForm = this.visiteFB.group({
      'chantier_id': ['', Validators.required],
      'visitable_id': ['', Validators.required],
      'chantier': [null],
      'salarie_id': [{value:null, disabled:false}, Validators.required],
      'entreprise_id': [{value:null, disabled:false}, Validators.required],
      'interimaire_id': [{value:null, disabled:false}],
      'nom_prenom': [{value:null, disabled:false}],
      'redacteur_id': [{value:this.currentUser.id, disabled:true}, Validators.required],
      'date_visite': [moment().format('DD/MM/YYYY'), Validators.required],
      'presence_non_conformite': [{value:false, disabled: true}],
      'has_rectification_imm': [{value:false, disabled: true}],
      'avertissement': [{value:false, disabled: false}],
      'type_id': [null, Validators.required],
      'catQuestionsList': this.visiteFB.array([]),
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
  }
  
  setDynamicValidators() {
    const salarie_id = this.visiteForm.get('salarie_id');
    const entreprise_id = this.visiteForm.get('entreprise_id');
    const chantier_id = this.visiteForm.get('chantier_id');

    this.visiteForm.get('chantier_id').valueChanges.subscribe(chantier_id => {
      if(chantier_id != this.visiteForm.get('visitable_id').value){
        this.visiteForm.get('visitable_id').setValue(chantier_id);
      }
    })
    this.visiteForm.get('visitable_id').valueChanges.subscribe(visitable_id => {
      if(visitable_id != this.visiteForm.get('chantier_id').value){ 
        this.visiteForm.get('chantier_id').setValue(visitable_id);
      }
    })

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
      form.presence_non_conformite = this.getPresenceNc();
      form.has_rectification_imm = this.getHasRectifImmediate();

      this.visiteService.create(form)
        .toPromise()
        .then((visite) => {
          this.formloading = false;
          this.cdr.markForCheck();
          
          Swal.fire({
            icon: 'success',
            title: this.translate.instant("VISITES.NOTIF.VISIT_CREATED.TITLE"),
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
            title: this.translate.instant("NOTIF.INCOMPLETE_FORM.TITLE"),
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

    var test: boolean = this.visiteForm.get('chantier_id').invalid ||
      this.visiteForm.get('type_id').invalid ||
      this.visiteForm.get('salarie_id').invalid || 
      this.visiteForm.get('entreprise_id').invalid ||
      this.visiteForm.get('interimaire_id').invalid || 
      this.visiteForm.get('nom_prenom').invalid;
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
      const catQuestionsListFormArray = this.visiteForm.get('catQuestionsList') as FormArray
      
      this.catQuestionsList.forEach((element, i) => {
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
                'note': [null, Validators.required],
                'date_remise_conf': [{value:null, disabled:true}],
                'observation': [''],
                'action_to_visited': [{value:0, disabled:true}]
              })
            });
          }

          this.setPivotRules(question)
          questionsArrayFB.push(question);			
        })
        var cat = this.visiteFB.group({
          'id': [element.id],
          'libelle': [element.libelle],
          'code': [ element.code],
          'questions': this.visiteFB.array(questionsArrayFB)
        })

        catQuestionsListFormArray.push(cat)
      })
      
    }
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
    console.log(this.visiteForm);
  }

  getNotes() {
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

  getPresenceNc(){
    return this.getNotes().ko > 0;
  }

  getHasRectifImmediate(){
    return this.getNotes().ko > 0 && this.getNotes().ko_unsolved == 0
  }

}
