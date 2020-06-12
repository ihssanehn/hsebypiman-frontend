import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from "@angular/forms";
import { CommonModule, Location } from '@angular/common';
import * as moment from 'moment';

import { TranslateService } from '@ngx-translate/core';
import { VisiteVehiculeService, TypeService, CatQuestionService } from '@app/core/services';
import { VisiteVehicule, Type, Vehicule, CatQuestion } from '@app/core/models';
import { NgxPermissionsService } from 'ngx-permissions';
import { AuthService, User } from '@app/core/auth';
import { MatSnackBar } from '@angular/material';
import Swal from 'sweetalert2';
import {extractErrorMessagesFromErrorResponse} from '@app/core/_base/crud';
import {FormStatus} from '@app/core/_base/crud/models/form-status';
import { DateFrToEnPipe } from '@app/core/_base/layout';
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
    private dateFrToEnPipe:DateFrToEnPipe
  ) {
		this.authService.currentUser.subscribe(x=> this.currentUser = x);
   }

  ngOnInit() {
    this.visite = new VisiteVehicule();
    this.createForm();    
    //this.setDynamicValidators();
  }

  
  createForm() {
		this.visiteForm = this.visiteFB.group({
      'vehicule': ['', Validators.required],
      'salarie_id': [{value:null, disabled:false}, Validators.required],
      //'entreprise_id': [{value:null, disabled:false}, Validators.required],
      'redacteur_id': [{value:this.currentUser.id, disabled:true}, Validators.required],
      'date_visite': [moment().format('YYYY-MM-DD'), Validators.required],
      'presence_non_conformite': [{value:false, disabled: true}],
      'has_rectification_imm': [{value:false, disabled: false}],
      'avertissement': [{value:false, disabled: false}],
      'type_id': [null, Validators.required],
      'questions': this.visiteFB.array([]),
      'catQuestionsList' : this.visiteFB.array([]),
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
		this.loaded = true;
  }
  
  // setDynamicValidators() {
  //   const salarie_id = this.visiteForm.get('salarie_id');
  //   const entreprise_id = this.visiteForm.get('entreprise_id');

  //   this.visiteForm.get('salarie_id').valueChanges.subscribe(salarie_id => {
  //       if (salarie_id != null) {
  //         entreprise_id.setValidators(null);
  //         entreprise_id.disable({onlySelf:true, emitEvent:false});
  //       }else{
  //         entreprise_id.setValidators(Validators.required);
  //         entreprise_id.enable({onlySelf:true, emitEvent:false});
  //       }
  //     })
  //     this.visiteForm.get('entreprise_id').valueChanges.subscribe(entreprise_id => {
  //       if (entreprise_id != null) {
  //         salarie_id.setValidators(null);
  //         salarie_id.disable({onlySelf:true, emitEvent:false});
  //       }else{
  //         salarie_id.setValidators(Validators.required);
  //         salarie_id.enable({onlySelf:true, emitEvent:false});
  //       }
  //   })
  // }

  // onVehiculeSelected(vehiculeId: Number) {
  //   this.getVehicule(vehiculeId);
  // }

  // async getVehicule(vehiculeId){
  //   var res = await this.vehiculeService.get(vehiculeId).toPromise();
  //   this.vehicule = res.result.data;
  // }

  async onUserSelected(form){
    this.visiteForm.patchValue(form);
    this.displayQuestions();
  }

  async onSubmit(event){
    try {
      let form = {...this.visiteForm.getRawValue()};
      this.formStatus.onFormSubmitting();
      this.parseDates(form);

      this.visiteService.create(form)
        .toPromise()
        .then((visite) => {
          this.cdr.markForCheck();
          
          Swal.fire({
            icon: 'success',
            title: 'Visite créée avec succès',
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            this.router.navigate(['/visites-securite/vehicules/list']);
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

  parseQuestions(item){
    if(item.length > 0){

      const catQuestionsListFormArray: FormArray = this.visiteForm.get('catQuestionsList') as FormArray;

      item.forEach((element, i) => {
        let questionsArrayFB = []

        element.questions.forEach(quest => {
          var question = this.visiteFB.group({
            'id': [quest.id],
            'libelle': [quest.libelle],
            'pivot': this.visiteFB.group({
              'note':[{value:null, disabled:false}, Validators.required],
              'date_remise_conf':[{value:null, disabled:false}],
              'observation':[{value:'', disabled:false}]
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
    form.questions.forEach(x=>{
      x.pivot.date_remise_conf = this.dateFrToEnPipe.transform(x.pivot.date_remise_conf);
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
