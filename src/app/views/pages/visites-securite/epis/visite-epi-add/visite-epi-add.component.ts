import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from "@angular/forms";
import { CommonModule, Location } from '@angular/common';
import * as moment from 'moment';

import { TranslateService } from '@ngx-translate/core';
import { VisiteEpiService, TypeService, EpiService, CatQuestionService } from '@app/core/services';
import { VisiteEpi, Type, Epi, CatQuestion } from '@app/core/models';
import { NgxPermissionsService } from 'ngx-permissions';
import { AuthService, User } from '@app/core/auth';
import { MatSnackBar } from '@angular/material';
import Swal from 'sweetalert2';
import { extractErrorMessagesFromErrorResponse } from '@app/core/_base/crud';
import { FormStatus } from '@app/core/_base/crud/models/form-status';
import { DateFrToEnPipe } from '@app/core/_base/layout';

@Component({
  selector: 'tf-visite-epi-add',
  templateUrl: './visite-epi-add.component.html',
  styleUrls: ['./visite-epi-add.component.scss']
})
export class VisiteEpiAddComponent implements OnInit {

  visite: VisiteEpi;
  visiteForm: FormGroup;
  // allRoles: Role[];
  formStatus = new FormStatus();
  loaded = false;
  invalid = [];
  editMode: boolean = false;
  epi: Epi;
  currentUser: User;
  questionsDisplayed: boolean = false;
  showSignatures: boolean = false;
  catQuestionsList: any;
  // Private properties

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private visiteFB: FormBuilder,
    // private notificationService: NzNotificationService,
    private visiteService: VisiteEpiService,
    private epiService: EpiService,
    private location: Location,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    public snackBar: MatSnackBar,
    private dateFrToEnPipe: DateFrToEnPipe,
    private catQuestionsService : CatQuestionService
  ) { 
		this.authService.currentUser.subscribe(x=> this.currentUser = x);
  }

  async ngOnInit() {
    this.createForm();
  }
  async getQuestions(){
    this.catQuestionsList = (await this.catQuestionsService.getAll({type_id : this.visiteForm.get('type_id').value}).toPromise()).result.data;
    this.patchQuestionsForm();
  }

  createForm() {
    this.visiteForm = this.visiteFB.group({
      'epi_id': ['', Validators.required],
      'salarie_id': [{ value: null, disabled: false }, Validators.required],
      'entreprise_id': [{ value: null, disabled: false }, Validators.required],
      'redacteur_id': [{ value: this.currentUser.id, disabled: true }, Validators.required],
      'date_visite': [moment().format('YYYY-MM-DD'), Validators.required],
      // 'is_validated_redacteur': ['', Validators.required],
      // 'is_validated_visite': ['', Validators.required],
      // 'validated_redacteur_at': ['', Validators.required],
      // 'validated_visite_at': ['', Validators.required],
      'catQuestionsList' : this.visiteFB.array([]),
      'presence_non_conformite': [{ value: false, disabled: true }],
      'has_rectification_imm': [{ value: false, disabled: false }],
      'avertissement': [{ value: false, disabled: false }],
      'type_id': [null, Validators.required],
      'questions': this.visiteFB.array([]),
      'signature_redacteur': this.visiteFB.group({
        'date': [null, Validators.required],
        'signature': [null, Validators.required]
      }),
      'signature_visite': this.visiteFB.group({
        'date': [null, Validators.required],
        'signature': [null, Validators.required]
      }),
      'signature_resp_hse': this.visiteFB.group({
        'date': [{ value: null, disabled: true }],
        'signature': [{ value: null, disabled: true }]
      }),
    });
    this.loaded = true;
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
						'observation': ['']
					})
				});
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

  async onEpiSelected(form) {
    this.visiteForm.patchValue(form);

    await this.getQuestions();
    this.displayQuestions();
  }

  async onSubmit(event) {
    try {
      let form = { ...this.visiteForm.getRawValue() };
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
            this.router.navigate(['/visites-securite/epis/list']);
          });
        })
        .catch(err => {

          Swal.fire({
            icon: 'error',
            title: 'Echec! le formulaire est incomplet',
            showConfirmButton: false,
            timer: 1500
          });

          if (err.status === 422) {
            var messages = extractErrorMessagesFromErrorResponse(err);
            this.formStatus.onFormSubmitResponse({ success: false, messages: messages });
            this.cdr.markForCheck();
          }

        });

      this.cdr.markForCheck();
    } catch (error) {
      console.error(error);
      throw error;
    }

  }

  cantDisplayQuestions() {
    var test: boolean = this.visiteForm.get('epi_id').invalid ||
      this.visiteForm.get('type_id').invalid ||
      this.visiteForm.get('salarie_id').invalid ||
      this.visiteForm.get('entreprise_id').invalid;

    return test;
  }

  displayQuestions() {
    this.questionsDisplayed = true;
    this.visiteForm.get('type_id').disable();
  }

  parseDates(form) {
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

  questionsLoaded() {
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
    const questionsList = this.visiteForm.get('catQuestionsList');
    return questionsList.value.length > 0 && !questionsList.invalid
  }  

  displaySignature() {
    this.showSignatures = !this.showSignatures
  }
}
