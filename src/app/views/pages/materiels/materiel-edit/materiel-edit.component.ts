import { Component,OnInit,OnDestroy,ChangeDetectorRef } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { FormBuilder,FormGroup,Validators,FormControl, FormArray } from "@angular/forms";
import { BehaviorSubject,Observable,of ,Subscription } from "rxjs";
import { finalize, takeUntil, tap } from 'rxjs/operators';

import { Location } from '@angular/common';
import { MaterielService,TypeService } from '@app/core/services';
import { Paginate } from '@app/core/_base/layout/models/paginate.model';
import { Materiel } from '@app/core/models';
import { NgxPermissionsService } from 'ngx-permissions';
import { SubheaderService } from '@app/core/_base/layout/services/subheader.service';
import moment from 'moment';
import Swal from 'sweetalert2';
import { DateEnToFrPipe, DateFrToEnPipe } from '@app/core/_base/layout';
import {extractErrorMessagesFromErrorResponse} from '@app/core/_base/crud';
import {FormStatus} from '@app/core/_base/crud/models/form-status';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'tf-materiel-edit',
	templateUrl: './materiel-edit.component.html',
	styleUrls: ['./materiel-edit.component.scss']
})

export class MaterielEditComponent implements OnInit, OnDestroy {

	errors;
	materielForm: FormGroup;
  	formStatus = new FormStatus();
	materiel: Materiel;
	// allRoles: Role[];
	loaded: boolean = false;
	formloading: boolean = false;
	editMode: boolean = false;
	// Private properties
	private subscriptions: Subscription[] = [];

	/**
	 * Component constructor
	 *
	 * @param activatedRoute: ActivatedRoute
	 * @param router: Router
	 * @param materielFB: FormBuilder
	 * @param layoutUtilsService: LayoutUtilsService
	 */
	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private materielFB: FormBuilder,
		// private notificationService: NzNotificationService,
		private materielService: MaterielService,
		private cdr: ChangeDetectorRef,
		private permissionsService: NgxPermissionsService,
		private translate: TranslateService,
		private location: Location,
		private subheaderService:SubheaderService,
		private dateFrToEnPipe:DateFrToEnPipe,
		private dateEnToFrPipe:DateEnToFrPipe,
	) {	}
	
	ngOnInit() {
		this.createForm();
    	this.setDynamicValidators();
		const routeSubscription = this.activatedRoute.params.subscribe(
			async params => {
				const id = params.id;
				if (id) {
					this.materielService.get(id).pipe(
						tap(res=>{
							var materiel = res.result.data;
							this.formatDates(materiel, 'EnToFr');
							this.materielForm.patchValue(materiel);
						})
					).subscribe( async res => {
						this.materiel = res.result.data;
						this.loaded = true;
						this.cdr.markForCheck();
					});

				} else {
					this.router.navigateByUrl('/materiel/list');
				}
			}
		);
		this.subscriptions.push(routeSubscription);
  	}
    
	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}

	/**
	 * Redirect to list
	 *
	 */
	goBackWithId() {
		const url = `/materiel/list`;
		this.router.navigateByUrl(url, {
			relativeTo: this.activatedRoute
		});
	}

	createForm() {
		this.materielForm = this.materielFB.group({
			libelle: ['', Validators.required],
			code: [null],
			numero_serie: [''],
			categorie_id: [null, Validators.required],
			marque: [''],
			description: [''],
			fournisseur: [''],
			date_entree: [null],
			date_sortie: [null],
			formation_requise: [''],
			habilitation_requise: [0],
			has_controle: [0],
			frequence_controle: [null],
			is_location: [0],
			cout: [null],
			date_fin_garantie: [null]
		});
	}

	setDynamicValidators(){
		const has_controle = this.materielForm.get('has_controle');
		const frequence_controle = this.materielForm.get('frequence_controle');
		
		has_controle.valueChanges.subscribe(x=>{
		if(x == 1){
			frequence_controle.enable();
		}else{
			frequence_controle.disable();
		}
		})
	}
  
	/**
	 * Refresh user
	 *
	 * @param isNew: boolean
	 * @param id: number
	 */
	refreshMateriel(id) {
		let url = this.router.url;
		url = `/materiel/edit/${id}`;
		this.router.navigateByUrl(url, {
			relativeTo: this.activatedRoute
		});
	}

	async onSubmit(event) {
		try {
			this.formloading = true;
			this.formStatus.onFormSubmitting();
			let form = {...this.materielForm.getRawValue()};
			
			this.formatDates(form, 'FrToEn');
			form.id = this.materiel.id;
			
			this.materielService.update(form)
				.toPromise()
				.then((materiel) => {
					this.formloading = false;
					this.cdr.markForCheck();

					Swal.fire({
						icon: 'success',
						title: this.translate.instant("MATERIELS.NOTIF.MATERIEL_UPDATED.TITLE"),
						showConfirmButton: false,
						timer: 1500
					}).then(() => {
            			this.location.back();
					});
				})
				.catch(err => {
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

	cancel() {
		this.location.back();
	}

	
	formatDates(item, direction){
		item.date_entree = direction == 'FrToEn' ? this.dateFrToEnPipe.transform(item.date_entree) : this.dateEnToFrPipe.transform(item.date_entree);
		item.date_sortie = direction == 'FrToEn' ? this.dateFrToEnPipe.transform(item.date_sortie) : this.dateEnToFrPipe.transform(item.date_sortie);
		item.date_fin_garantie = direction == 'FrToEn' ? this.dateFrToEnPipe.transform(item.date_fin_garantie) : this.dateEnToFrPipe.transform(item.date_fin_garantie);
	  }
}
