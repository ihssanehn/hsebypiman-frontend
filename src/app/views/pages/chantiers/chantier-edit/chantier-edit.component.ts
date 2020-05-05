import { Component,OnInit,OnDestroy,ChangeDetectorRef } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { FormBuilder,FormGroup,Validators,FormControl, FormArray } from "@angular/forms";
import { BehaviorSubject,Observable,of ,Subscription } from "rxjs";
import { finalize, takeUntil, tap } from 'rxjs/operators';

import { Location } from '@angular/common';
import { ChantierService,TypeService } from '@app/core/services';
import { Paginate } from '@app/core/_base/layout/models/paginate.model';
import { Chantier } from '@app/core/models';
import { NgxPermissionsService } from 'ngx-permissions';
import { SubheaderService } from '@app/core/_base/layout/services/subheader.service';
import * as moment from 'moment';
import Swal from 'sweetalert2';

@Component({
	selector: 'tf-chantier-edit',
	templateUrl: './chantier-edit.component.html',
	styleUrls: ['./chantier-edit.component.scss']
})

export class ChantierEditComponent implements OnInit, OnDestroy {

	errors;
	chantierForm: FormGroup;
	chantier: Chantier;
	// allRoles: Role[];
	loaded: boolean = false;
	editMode: boolean = false;
	// Private properties
	private subscriptions: Subscription[] = [];

	/**
	 * Component constructor
	 *
	 * @param activatedRoute: ActivatedRoute
	 * @param router: Router
	 * @param chantierFB: FormBuilder
	 * @param layoutUtilsService: LayoutUtilsService
	 */
	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private chantierFB: FormBuilder,
		// private notificationService: NzNotificationService,
		private chantierService: ChantierService,
		private cdr: ChangeDetectorRef,
		private permissionsService: NgxPermissionsService,
		private location: Location,
		private subheaderService:SubheaderService,
	) {	}
	
	ngOnInit() {
		this.createForm();
    	this.setDynamicValidators();
		const routeSubscription = this.activatedRoute.params.subscribe(
			async params => {
				const id = params.id;
				if (id) {
					this.chantierService.get(id).pipe(
						tap(res=>{
							this.chantierForm.patchValue(res.result.data);							
							this.formPathValues(res.result.data);
							
							this.chantierForm.controls['entreprises'].patchValue(res.result.data.entreprises);
						})
					).subscribe( async res => {
						this.chantier = res.result.data;
						this.loaded = true;
						this.cdr.detectChanges();
						this.cdr.markForCheck();
					});

				} else {
					this.router.navigateByUrl('/chantiers/list');
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
		const url = `/chantiers/list`;
		this.router.navigateByUrl(url, {
			relativeTo: this.activatedRoute
		});
	}

	createForm() {
		this.chantierForm = this.chantierFB.group({
			nom: ['', Validators.required],
			type_id: [null, Validators.required],
			adresse: ['', Validators.required],
			ville: ['', Validators.required],
			code_postal: ['', Validators.required],
			pays: ['', Validators.required],
			client: ['', Validators.required],
			contact: ['', Validators.required],
			montant: ['', Validators.required],
			date_demarrage: ['', Validators.required],
			charge_affaire_id: [null, Validators.required],
			status_id: [null, Validators.required],
			numero: ['', Validators.required],
			resp_chiffrage_id: [null, Validators.required],
			no_hab_required: [0, Validators.required],
			habilitations: this.chantierFB.array([], Validators.required),
			entreprises: this.chantierFB.array([])
		});
	}

	setDynamicValidators(){
		const no_hab_required = this.chantierForm.get('no_hab_required');
	}
  
	formPathValues(chantier){
		const habformArray: FormArray = this.chantierForm.get('habilitations') as FormArray;
		if(chantier.no_hab_required){
			habformArray.setValidators(null);
			habformArray.disable();
		}else{
			chantier.habilitations.forEach(element => {
				habformArray.push(new FormControl(element.id));
			});
		}

		const ees: FormArray = this.chantierForm.get('entreprises') as FormArray;
		chantier.entreprises.forEach(element =>{
			ees.push(
				this.chantierFB.group({
					type_code:[element.type.code, Validators],
					entreprise_id: [element.id, Validators.required],
					chiffre_affaire: [element.pivot.chiffre_affaire, Validators],
					date_demarrage: [element.pivot.date_demarrage, Validators],
				})
			)
		})
		
	}
	/**
	 * Refresh user
	 *
	 * @param isNew: boolean
	 * @param id: number
	 */
	refreshChantier(id) {
		let url = this.router.url;
		url = `/chantiers/edit/${id}`;
		this.router.navigateByUrl(url, {
			relativeTo: this.activatedRoute
		});
	}

	async onSubmit(event) {
		try {
			let result;

			let form = {...this.chantierForm.value};
			form.date_demarrage = form.date_demarrage ? moment(form.date_demarrage).format('YYYY-MM-DD') : null
			form.id = this.chantier.id;
			if(form.entreprises.length > 0){
				form.entreprises.forEach(x=>{
				x.date_demarrage = this.setDateFormat(x.date_demarrage);
				})
			}
			this.chantierService.update(form)
				.toPromise()
				.then((chantier) => {
					this.errors = false;
					this.cdr.markForCheck();

					Swal.fire({
						icon: 'success',
						title: 'Chantié mis à jour avec succès',
						showConfirmButton: false,
						timer: 1500
					}).then(() => {
            			this.location.back();
					});
				})
				.catch(err => {

					Swal.fire({
						icon: 'error',
						title: 'Echec! le formulaire est incomplet',
						showConfirmButton: false,
						timer: 1500
					});

					if (err.status === 422)
						this.chantierForm = {
							...err.error
						};
					this.errors = true;

				});

			this.cdr.markForCheck();
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	setDateFormat(date) {
		return date ? moment(date).format('YYYY-MM-DD') : null;
	}

	cancel() {
		this.location.back();
	}
}
