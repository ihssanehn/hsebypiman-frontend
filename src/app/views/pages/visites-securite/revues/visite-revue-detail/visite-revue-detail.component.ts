import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormArray } from "@angular/forms";
import moment from 'moment';
import { Subscription } from "rxjs";
import { tap } from 'rxjs/operators';

import { RevueService } from '@app/core/services';
import { Revue , CatQuestion} from '@app/core/models';
import { User } from '@app/core/auth';
import { MatSnackBar } from '@angular/material';
import Swal from 'sweetalert2';
import { extractErrorMessagesFromErrorResponse } from '@app/core/_base/crud';
import { FormStatus } from '@app/core/_base/crud/models/form-status';
import { DateFrToEnPipe, DateEnToFrPipe } from '@app/core/_base/layout';
import { TranslateService } from '@ngx-translate/core';


@Component({
	selector: 'tf-visite-revue-detail',
	templateUrl: './visite-revue-detail.component.html',
	styleUrls: ['./visite-revue-detail.component.scss']
})
export class VisiteRevueDetailComponent implements OnInit, OnDestroy {

	canValidateHse: boolean = true;
	public visite: Revue;
	visiteForm: FormGroup;
	// allRoles: Role[];
	formStatus = new FormStatus();
	isDisableToggle: boolean = false;
	loaded = false;
	invalid = [];
	editMode: boolean = false;
	showSignatures: boolean = false;
	catQuestionsList: CatQuestion[];
	currentUser: User;
	questionsDisplayed: boolean = false;
	private subscriptions: Subscription[] = [];

	// Private properties

	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private visiteFB: FormBuilder,
		// private notificationService: NzNotificationService,
		private visiteService: RevueService,
		private cdr: ChangeDetectorRef,
		public snackBar: MatSnackBar,
		private dateFrToEnPipe: DateFrToEnPipe,
		private dateEnToFrPipe: DateEnToFrPipe,
		private translate: TranslateService
	) {}

	ngOnInit() {
		this.initForm();
		const routeSubscription = this.activatedRoute.params.subscribe(async params => {
			const id = params.id;
			if (id) {
				this.visiteService.get(id).pipe(
					tap(res => {
						var _visite = res.result.data
						this.parseVisitesDate(_visite, 'EnToFr');
						this.visiteForm.patchValue(_visite);
						this.patchQuestionsForm(_visite);
						this.catQuestionsList = res.result.data.catQuestionsList;
						// this.visiteForm.disable();
					})
				).subscribe(async res => {
					var _visite = res.result.data;
					this.visite = _visite;
					this.loaded = true;
					this.cdr.markForCheck();
				});

			} else {
				this.router.navigateByUrl('/revues/list');
			}
		});

		this.subscriptions.push(routeSubscription);
	}

	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}

	initForm() {
		this.visiteForm = this.visiteFB.group({
			'id': [{value: null, disabled: true}],
			'code': [{value:null, disabled:true}],
			'salarie_id': [{value: null, disabled: true}],
			'entreprise_id': [{value: null, disabled: true}],
			'environnement': [{value: null, disabled: true}],
			'environnement_autre': [{value: null, disabled: true}],
			'lieu_mission': [{value: null, disabled: true}],
			'redacteur_id': [{value: null, disabled: true}],
			'date_visite': [{value:moment().format('YYYY-MM-DD'), disabled: true}],
			'presence_non_conformite': [{value: false, disabled: true }],
			'has_rectification_imm': [{value: false, disabled: true }],
			'avertissement': [{value: false, disabled: true }],
			'type_id': [{value:null, disabled:true}],
			'catQuestionsList': this.visiteFB.array([]),
			'is_validate_resp_hse': [{value:null, disabled:true}],
			'signature_redacteur': this.visiteFB.group({
				'date':[{value:null, disabled:true}],
				'signature': [{value:null, disabled:true}]
			  }),
			  'signature_visite': this.visiteFB.group({
				'date':[{value:null, disabled:true}],
				'signature': [{value:null, disabled:true}]
			  }),
			  'signature_resp_hse': this.visiteFB.group({
				'date':[{value:null, disabled:true}],
				'signature': [{value:null, disabled:true}]
			  }),
		});
		this.loaded = true;
	}

	parseVisitesDate(item, direction) {
		item.date_visite = direction == 'FrToEn' ? this.dateFrToEnPipe.transform(item.date_visite) : this.dateEnToFrPipe.transform(item.date_visite);
		if (item.questions.length > 0) {
			item.questions.forEach(x => {
				x.pivot.date_remise_conf = direction == 'FrToEn' ? this.dateFrToEnPipe.transform(x.pivot.date_remise_conf) : this.dateEnToFrPipe.transform(x.pivot.date_remise_conf);
			})
		}
	}

	patchQuestionsForm(visite) {

		const catQuestionsListFormArray: FormArray = this.visiteForm.get('catQuestionsList') as FormArray;
		visite.catQuestionsList.forEach((element, i) => {
			let questionsArrayFB = []
			element.questions.forEach(quest => {
				var question = this.visiteFB.group({
					'id': [{ value: quest.id, disabled: true }],
					'libelle': [{ value: quest.libelle, disabled: true }],
					'pivot': this.visiteFB.group({
						'note': [{ value: quest.pivot.note, disabled: true }],
						'date_remise_conf': [{ value: quest.pivot.date_remise_conf, disabled: true }],
						'observation': [{ value: quest.pivot.observation, disabled: true }]
					})
				});
				questionsArrayFB.push(question);			
			})
			var cat = this.visiteFB.group({
				'id': [{value :element.id, disabled: true}],
				'libelle': [{value:element.libelle, disabled: true}],
				'code': [{value : element.code, disabled: true}],
				'questions': this.visiteFB.array(questionsArrayFB)
			})
			catQuestionsListFormArray.push(cat);
			
		})

		const signatureRedacteur = this.visiteForm.get('signature_redacteur') as FormGroup;
		if(visite.sign_redacteur){
			signatureRedacteur.patchValue(visite.sign_redacteur);
		}
		const signatureVisite = this.visiteForm.get('signature_visite') as FormGroup;
		if(visite.sign_visite){
			signatureVisite.patchValue(visite.sign_visite);
		}
		const signatureRespHse = this.visiteForm.get('signature_resp_hse') as FormGroup;
		if(visite.sign_resp_hse){
			signatureRespHse.patchValue(visite.sign_resp_hse);
		}

		this.showSignatures = true;
	}

	questionsLoaded() {
		return this.visiteForm.get('catQuestionsList').value.length > 0
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
				title: this.translate.instant("VISITES.NOTIF.VISIT_UPDATED.TITLE"),
				showConfirmButton: false,
				timer: 1500
			  });
			})
			.catch(err =>{ 
	
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
		  console.error(error);
		  throw error;
		}
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
	
	duplicateVs(visiteId){
		this.router.navigate(['visites-securite/revues/add'], {queryParams:{visite_id:visiteId}})
	}
	
}
