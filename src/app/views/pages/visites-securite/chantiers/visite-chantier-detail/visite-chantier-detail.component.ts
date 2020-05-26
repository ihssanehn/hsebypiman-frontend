import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from "@angular/forms";
import { Location } from '@angular/common';
import * as moment from 'moment';
import { Subscription } from "rxjs";
import { tap } from 'rxjs/operators';

import { VisiteService, ChantierService } from '@app/core/services';
import { Visite, Chantier } from '@app/core/models';
import { AuthService, User } from '@app/core/auth';
import { MatSnackBar } from '@angular/material';
import Swal from 'sweetalert2';
import { extractErrorMessagesFromErrorResponse } from '@app/core/_base/crud';
import { FormStatus } from '@app/core/_base/crud/models/form-status';
import { DateFrToEnPipe, DateEnToFrPipe } from '@app/core/_base/layout';


@Component({
	selector: 'tf-visite-chantier-detail',
	templateUrl: './visite-chantier-detail.component.html',
	styleUrls: ['./visite-chantier-detail.component.scss']
})
export class VisiteChantierDetailComponent implements OnInit, OnDestroy {


	public visite: Visite;
	visiteForm: FormGroup;
	// allRoles: Role[];
	formStatus = new FormStatus();
	isDisableToggle: boolean = false;
	loaded = false;
	invalid = [];
	editMode: boolean = false;
	showSignatures: boolean = false;
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
		private visiteService: VisiteService,
		private chantierService: ChantierService,
		private location: Location,
		private authService: AuthService,
		private cdr: ChangeDetectorRef,
		public snackBar: MatSnackBar,
		private dateFrToEnPipe: DateFrToEnPipe,
		private dateEnToFrPipe: DateEnToFrPipe
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
						// this.visiteForm.disable();
					})
				).subscribe(async res => {
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
	}

	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}

	initForm() {
		this.visiteForm = this.visiteFB.group({
			'id': [{value: null, disabled: true}, Validators.required],
			'chantier_id': [{value:null, disabled:true}, Validators.required],
			'salarie_id': [{value: null, disabled: false}, Validators.required],
			'entreprise_id': [{value: null, disabled: false}, Validators.required],
			'redacteur_id': [{value: null, disabled: true}, Validators.required],
			'date_visite': [{value:moment().format('YYYY-MM-DD'), disabled: true}, Validators.required],
			'presence_non_conformite': [{value: false, disabled: true }],
			'has_rectification_imm': [{value: false, disabled: false }],
			'avertissement': [{value: false, disabled: false }],
			'type_id': [{value:null, disabled:true}, Validators.required],
			'questions': this.visiteFB.array([]),
			'is_validate_resp_hse': [{value:null, disabled:true}],
			'signature_redacteur': this.visiteFB.group({
				'date':[{value:null, disabled:true}, Validators.required],
				'signature': [{value:null, disabled:true}, Validators.required]
			  }),
			  'signature_visite': this.visiteFB.group({
				'date':[{value:null, disabled:true}, Validators.required],
				'signature': [{value:null, disabled:true}, Validators.required]
			  }),
			  'signature_resp_hse': this.visiteFB.group({
				'date':[{value:null, disabled:true}],
				'signature': [{value:null, disabled:true}]
			  }),
		});
		this.loaded = true;
		this.cdr.detectChanges();
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

		const questionsFormArray: FormArray = this.visiteForm.get('questions') as FormArray;
		visite.questions.forEach(element => {
			var question = this.visiteFB.group({
				'id': [{value:element.id, disabled:true}],
				'libelle': [{value:element.libelle, disabled:true}],
				'pivot': this.visiteFB.group({
					'note': [{value:element.pivot.note, disabled: true }, Validators.required],
					'date_remise_conf': [{value: element.pivot.date_remise_conf, disabled: true }],
					'observation': [{value: element.pivot.observation, disabled: true }]
				})
			});
			questionsFormArray.push(question);
		})

		const signatureRedacteur = this.visiteForm.get('signature_redacteur') as FormGroup;
		if(visite.signatureRedacteur){
			signatureRedacteur.patchValue(visite.signatureRedacteur);
		}
		const signatureVisite = this.visiteForm.get('signature_visite') as FormGroup;
		if(visite.signatureVisite){
			signatureVisite.patchValue(visite.signatureVisite);
		}
		const signatureRespHse = this.visiteForm.get('signature_resp_hse') as FormGroup;
		if(visite.signatureRespHse){
			signatureRespHse.patchValue(visite.signatureRespHse);
		}

		this.showSignatures = true;

	}

	questionsLoaded() {
		return this.visiteForm.get('questions').value.length > 0
	}

	editVisite(visiteId) {
		this.router.navigate(['visites-securite/chantiers/edit', visiteId]);
	}
	deleteVisite(visiteId) {
		Swal.fire({
			title: 'Désolé cette fonctionnalité n\'a pas encore été implémentée',
			showConfirmButton: false,
			timer: 1500
		})
	}
	
}
