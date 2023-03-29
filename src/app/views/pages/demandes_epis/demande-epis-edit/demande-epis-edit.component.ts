import { Component,OnInit,OnDestroy,ChangeDetectorRef } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { FormBuilder,FormGroup,Validators, FormArray, FormControl } from "@angular/forms";
import { Subscription } from "rxjs";
import { tap } from 'rxjs/operators';
import { Location } from '@angular/common';
import { DemandeEpisService } from '@app/core/services';
import { DemandeEpis } from '@app/core/models';
import Swal from 'sweetalert2';
import {FormStatus} from '@app/core/_base/crud/models/form-status';
import { TranslateService } from '@ngx-translate/core';
import { DateFrToEnPipe } from '@app/core/_base/layout';


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
							// this.demandeEpisForm.get('id').setValue(res.id);
							this.demandeEpisForm.patchValue(res);
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
			delivery_type: [null, Validators.required],
      delivery_societe_nom: [null, Validators.compose([])],
      delivery_attention: [null, Validators.compose([])],
      delivery_nom: [null, Validators.compose([])],
      delivery_prenom: [null, Validators.compose([])],
      delivery_numero: [null, Validators.compose([])],
      delivery_rue: [null, Validators.compose([])],
      delivery_cp: [null, Validators.compose([])],
      delivery_ville: [null, Validators.compose([])],
      delivery_pays: [null, Validators.compose([])],
      bu_id: [null, Validators.compose([])],
      bu_autre: [null, Validators.compose([])],
    });

    const delivery_type = this.demandeEpisForm.get('delivery_type') as FormControl;
    const delivery_societe_nom = this.demandeEpisForm.get('delivery_societe_nom') as FormControl;
    const delivery_attention = this.demandeEpisForm.get('delivery_attention') as FormControl;
    const delivery_nom = this.demandeEpisForm.get('delivery_nom') as FormControl;
    const delivery_prenom = this.demandeEpisForm.get('delivery_prenom') as FormControl;
    const delivery_numero = this.demandeEpisForm.get('delivery_numero') as FormControl;
    const delivery_rue = this.demandeEpisForm.get('delivery_rue') as FormControl;
    const delivery_cp = this.demandeEpisForm.get('delivery_cp') as FormControl;
    const delivery_ville = this.demandeEpisForm.get('delivery_ville') as FormControl;
    const delivery_pays = this.demandeEpisForm.get('delivery_pays') as FormControl;
    const bu_id = this.demandeEpisForm.get('bu_id') as FormControl;
    const bu_autre = this.demandeEpisForm.get('bu_autre') as FormControl;

    delivery_type.valueChanges.subscribe(value=>{
      if(value == 3){
        bu_id.enable();
        bu_id.setValidators([Validators.required]);

        delivery_nom.disable();
        delivery_nom.setValidators([]);
        delivery_prenom.disable();
        delivery_prenom.setValidators([]);
        delivery_societe_nom.disable();
        delivery_societe_nom.setValidators([]);
        delivery_attention.disable();
        delivery_attention.setValidators([]);
        delivery_numero.disable()
        delivery_numero.setValidators([])
        delivery_rue.disable()
        delivery_rue.setValidators([])
        delivery_cp.disable()
        delivery_cp.setValidators([])
        delivery_ville.disable()
        delivery_ville.setValidators([])
        delivery_pays.disable()
        delivery_pays.setValidators([])
      }else{

        delivery_numero.enable();
        delivery_numero.setValidators([Validators.required]);
        delivery_rue.enable();
        delivery_rue.setValidators([Validators.required]);
        delivery_cp.enable();
        delivery_cp.setValidators([Validators.required]);
        delivery_ville.enable();
        delivery_ville.setValidators([Validators.required]);
        delivery_pays.enable();
        delivery_pays.setValidators([Validators.required]);

        if(value == 1){

          delivery_societe_nom.enable();
          delivery_societe_nom.setValidators([Validators.required]);
          delivery_attention.enable();
          delivery_attention.setValidators([Validators.required]);
          
          delivery_nom.disable();
          delivery_nom.setValidators([]);
          delivery_prenom.disable();
          delivery_prenom.setValidators([]);
          
        }else if(value == 2){
          
          delivery_nom.enable();
          delivery_nom.setValidators([Validators.required]);
          delivery_prenom.enable();
          delivery_prenom.setValidators([Validators.required]);

          delivery_societe_nom.disable();
          delivery_societe_nom.setValidators([]);
          delivery_attention.disable();
          delivery_attention.setValidators([]);

        }
      }
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
