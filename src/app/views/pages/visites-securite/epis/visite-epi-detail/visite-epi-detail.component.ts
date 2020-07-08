import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from "@angular/forms";
import { Location } from '@angular/common';
import * as moment from 'moment';
import { Subscription } from "rxjs";
import { tap } from 'rxjs/operators';

import { VisiteEpiService, MaterielService } from '@app/core/services';
import { VisiteEpi, Materiel } from '@app/core/models';
import { AuthService, User } from '@app/core/auth';
import { MatSnackBar } from '@angular/material';
import Swal from 'sweetalert2';
import { extractErrorMessagesFromErrorResponse } from '@app/core/_base/crud';
import { FormStatus } from '@app/core/_base/crud/models/form-status';
import { DateFrToEnPipe, DateEnToFrPipe } from '@app/core/_base/layout';


@Component({
	selector: 'tf-visite-epi-detail',
	templateUrl: './visite-epi-detail.component.html',
	styleUrls: ['./visite-epi-detail.component.scss']
})
export class VisiteEpiDetailComponent implements OnInit, OnDestroy {

	canValidateHse: boolean = true;
	public visite: VisiteEpi;
	visiteForm: FormGroup;
	// allRoles: Role[];
	formStatus = new FormStatus();
	isDisableToggle: boolean = false;
	loaded = false;
	invalid = [];
	editMode: boolean = false;
	showSignatures: boolean = false;
	epi: Materiel;
	currentUser: User;
	questionsDisplayed: boolean = false;
	private subscriptions: Subscription[] = [];
	catQuestionsList: any;

	// Private properties

	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private visiteFB: FormBuilder,
		// private notificationService: NzNotificationService,
		private visiteService: VisiteEpiService,
		private materielService: MaterielService,
		private location: Location,
		private authService: AuthService,
		private cdr: ChangeDetectorRef,
		public snackBar: MatSnackBar,
		private dateFrToEnPipe: DateFrToEnPipe,
		private dateEnToFrPipe: DateEnToFrPipe
	) { }

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
					this.visite = res.result.data;
					this.loaded = true;
					this.cdr.markForCheck();
				});

			} else {
				this.router.navigateByUrl('/epis/list');
			}
		});

		this.subscriptions.push(routeSubscription);
	}

	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}

	initForm() {
		this.visiteForm = this.visiteFB.group({
			'id': [{ value: null, disabled: true }, Validators.required],
			'code': [{value:null, disabled:true}],
			'is_externe': [{value:null, disabled:true}],
			'epi_id': [{ value: null, disabled: true }, Validators.required],
			'salarie_id': [{ value: null, disabled: true }, Validators.required],
			'entreprise_id': [{ value: null, disabled: true }, Validators.required],
			'redacteur_id': [{ value: null, disabled: true }, Validators.required],
			'date_visite': [{ value: moment().format('YYYY-MM-DD'), disabled: true }, Validators.required],
			'presence_non_conformite': [{ value: false, disabled: true }],
			'has_rectification_imm': [{ value: false, disabled: true }],
			'avertissement': [{ value: false, disabled: true }],
			'type_id': [{ value: null, disabled: true }, Validators.required],
			'catQuestionsList': this.visiteFB.array([]),
			'questions': this.visiteFB.array([]),
			'is_validate_resp_hse': [{ value: null, disabled: true }],
			'signature_redacteur': this.visiteFB.group({
				'date': [{ value: null, disabled: true }, Validators.required],
				'signature': [{ value: null, disabled: true }, Validators.required]
			}),
			'signature_visite': this.visiteFB.group({
				'date': [{ value: null, disabled: true }, Validators.required],
				'signature': [{ value: null, disabled: true }, Validators.required]
			}),
			'signature_resp_hse': this.visiteFB.group({
				'date': [{ value: null, disabled: true }],
				'signature': [{ value: null, disabled: true }]
			}),
		});
		this.loaded = true;
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
						'note': [{ value: quest.pivot.note, disabled: true }, Validators.required],
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
		if (visite.sign_redacteur) {
			signatureRedacteur.patchValue(visite.sign_redacteur);
		}
		const signatureVisite = this.visiteForm.get('signature_visite') as FormGroup;
		if (visite.sign_visite) {
			signatureVisite.patchValue(visite.sign_visite);
		}
		const signatureRespHse = this.visiteForm.get('signature_resp_hse') as FormGroup;
		if (visite.sign_resp_hse) {
			signatureRespHse.patchValue(visite.sign_resp_hse);
		}

		this.showSignatures = true;

	}

	parseVisitesDate(item, direction) {
		item.date_visite = direction == 'FrToEn' ? this.dateFrToEnPipe.transform(item.date_visite) : this.dateEnToFrPipe.transform(item.date_visite);
		if (item.questions.length > 0) {
			item.questions.forEach(x => {
				x.pivot.date_remise_conf = direction == 'FrToEn' ? this.dateFrToEnPipe.transform(x.pivot.date_remise_conf) : this.dateEnToFrPipe.transform(x.pivot.date_remise_conf);
			})
		}
	}


	questionsLoaded() {
		return this.visiteForm.get('questions').value.length > 0
	}

	editVisite(visiteId) {
		this.router.navigate(['visites-securite/epis/edit', visiteId]);
	}
	deleteVisite(visiteId) {
		this.visiteService.delete(visiteId).toPromise().then(res => {
			Swal.fire({
				icon: 'success',
				title: 'La visite a correctement été supprimé',
				showConfirmButton: false,
				timer: 1500
			});
			this.router.navigate(['visites-securite/epis/list']);
		}).catch(err => {
			Swal.fire({
				icon: 'error',
				title: "La visite n'a pas pu être supprimée",
				showConfirmButton: false,
				timer: 1500
			});
		})
	}

	async onSubmit(event) {
		try {
			let form = { ...this.visiteForm.getRawValue() };
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
						this.formStatus.onFormSubmitResponse({ success: false, messages: messages });;
						this.cdr.markForCheck();
					}

				});

			this.cdr.markForCheck();
		} catch (error) {
			console.error(error);
			throw error;
		}
	}



}
