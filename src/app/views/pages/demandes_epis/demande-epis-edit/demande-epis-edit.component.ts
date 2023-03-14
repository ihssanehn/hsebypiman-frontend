import { Component,OnInit,OnDestroy,ChangeDetectorRef } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { FormBuilder,FormGroup,Validators, FormArray } from "@angular/forms";
import { Subscription } from "rxjs";
import { tap } from 'rxjs/operators';
import { Location } from '@angular/common';
import { DemandeEpisService } from '@app/core/services';
import { DemandeEpis } from '@app/core/models';
import Swal from 'sweetalert2';
import {extractErrorMessagesFromErrorResponse} from '@app/core/_base/crud';
import {FormStatus} from '@app/core/_base/crud/models/form-status';
import { TranslateService } from '@ngx-translate/core';
import { DateFrToEnPipe } from '@app/core/_base/layout';
import moment from 'moment';


@Component({
	selector: 'tf-demande-epis-edit',
	templateUrl: './demande-epis-edit.component.html',
	styleUrls: ['./demande-epis-edit.component.scss']
})

export class DemandeEpisEditComponent implements OnInit, OnDestroy {

	errors;
	demandeEpisForm: FormGroup;
	formStatus = new FormStatus();
	demandeEpis: DemandeEpis;
	loaded: boolean = false;
	formloading: boolean = false;
	editMode: boolean = false;
	private subscriptions: Subscription[] = [];


	/**
	 * Component constructor
	 *
	 * @param activatedRoute: ActivatedRoute
	 * @param router: Router
	 * @param demandeFB: FormBuilder
	 * @param layoutUtilsService: LayoutUtilsService
	 */
	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private demandeFB: FormBuilder,
		private demandeEpisService: DemandeEpisService,
		private cdr: ChangeDetectorRef,
		private location: Location,
		private translate:TranslateService,
		private dateFrToEnPipe:DateFrToEnPipe,
	) {	}
	
	ngOnInit() {
		this.createForm();
		const routeSubscription = this.activatedRoute.params.subscribe(
			async params => {
				const id = params.id;
				if (id) {
					this.demandeEpisService.get(id).pipe(
						tap(res=>{
							this.demandeEpisForm.get('id').setValue(res.id);
							let epis = res.epis;
							epis.forEach(x=>this.loadEpis(x))
						})
					).subscribe( async res => {
						this.demandeEpis = res;
						this.loaded = true;
						this.cdr.markForCheck();
					});

				} else {
					this.router.navigateByUrl('/materiel/demandes-epis/list');
				}
			}
		);
		this.subscriptions.push(routeSubscription);
  	}
    
	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}

	loadEpis(epi){
		let displayExtraFields = epi.pivot.size || epi.pivot.criteria_id;
		let displaySubcategory = epi.pivot.subcategory_id;

		let epiForm = this.demandeFB.group({
			categorie_id: [epi.id, Validators.required],
			qte: [epi.pivot.qte, Validators.compose([Validators.required, Validators.min(1)])],
			comment: epi.pivot.comment,
			criteria_id: epi.pivot.criteria_id,
			subcategory_id: epi.pivot.subcategory_id,
			size: epi.pivot.size,
      displayExtraFields: displayExtraFields,
      displaySubcategory: displaySubcategory,
		})
		const epis = this.demandeEpisForm.controls['epis'] as FormArray;
		epis.push(epiForm);
	}
	/**
	 * Redirect to list
	 *
	 */
	goBackWithId() {
		const url = `/materiel/demandes-epis/list`;
		this.router.navigateByUrl(url, {
			relativeTo: this.activatedRoute
		});
	}

	createForm() {
		this.demandeEpisForm = this.demandeFB.group({
			id: [null, Validators.required],
			epis: this.demandeFB.array([]),
		});
	}
  
	/**
	 * Refresh user
	 *
	 * @param isNew: boolean
	 * @param id: number
	 */
	refreshRemonte(id) {
		let url = this.router.url;
		url = `/DemandeEpiss/edit/${id}`;
		this.router.navigateByUrl(url, {
			relativeTo: this.activatedRoute
		});
	}

	async onSubmit() {

		this.formloading = true;

		let _datas = this.demandeEpisForm.getRawValue();
		
		await this.demandeEpisService.update(this.demandeEpis.id, _datas).toPromise().then(res=>{
			Swal.fire({
				icon: 'success',
				title: this.translate.instant("DEMANDES_EPI.NOTIF.UPDATED.TITLE"),
				showConfirmButton: false,
				timer: 1500
			}).then(() => {
				this.location.back();
			});
		}).catch(error=>{
			this.formloading = false;
			console.error(error);
		})
		this.cdr.markForCheck();
			
	}

	cancel() {
		this.location.back();
	}


}
