import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Ar, Chantier, CatRisque } from '@app/core/models';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ArService, ChantierService, CatRisqueService, EpiTypesService } from '@app/core/services';
import { NgxPermissionsService } from 'ngx-permissions';
import { tap } from 'rxjs/operators';
import { Location } from '@angular/common';
import { EpiType } from '@app/core/models/epiType.model';

@Component({
  selector: 'tf-ar-detail',
  templateUrl: './ar-detail.component.html',
  styleUrls: ['./ar-detail.component.scss']
})
export class ArDetailComponent implements OnInit, OnDestroy {

  	public ar: Ar;
	loaded = false;
	private subscriptions: Subscription[] = [];
	public chantier : Chantier;
	displayedColumns: string[] = ['risks', 'actions', 'comments'];
	public risksList : Array<CatRisque>;
	public epiList : Array<EpiType>;

	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private arFB: FormBuilder,
		private arService: ArService,
		private cdr: ChangeDetectorRef,
		private permissionsService : NgxPermissionsService,
		private location: Location,
		protected chantierService: ChantierService,
		private catRisqueService: CatRisqueService,
		private epiTypesService: EpiTypesService,
	) { 
		this.getCatRisques();
		this.getEpiTypes();
	}

	ngOnInit() {
		const routeSubscription = this.activatedRoute.params.subscribe(
			async params => {
				const id = params.id;
				if (id) {
					this.getAr(id)
				} else {
					this.router.navigateByUrl('/analyses-risque/list');
				}
			}
		);
	}

	async getAr(arId: Number){
		try {
			var res = await this.arService.get(arId).toPromise();
			this.ar = res.result.data;
			this.getChantier(this.ar.chantier_id);
			this.cdr.markForCheck();
		} catch (error) {
			console.error(error);
		}
	}

	async getCatRisques(){
		var res = await this.catRisqueService.getAll().toPromise();
		this.risksList = res.result.data;
		this.cdr.detectChanges();
		this.cdr.markForCheck();
	}

	async getEpiTypes(){
		var res = await this.epiTypesService.getAll().toPromise();
		this.epiList = res.result.data;
		this.cdr.detectChanges();
		this.cdr.markForCheck();
	}

	async getChantier(chantierId: Number){
		try {
			var res = await this.chantierService.get(chantierId).toPromise();
			this.chantier = res.result.data;
			this.cdr.detectChanges();
			this.cdr.markForCheck();
		} catch (error) {
			console.error(error);
		}
	}

	onRiskIsChecked(riskId){
		const ids = this.ar.risques.map(item => item.id);
		return ids.includes(riskId);
	}
	
	onEpiIsChecked(epiId){
		const ids = this.ar.epi_types.map(item => item.id);
		return ids.includes(epiId);
	}

	getCommentValue(id){

		var commentValue = '';
		var cat_risques = this.ar.cat_risques.filter(x=>x.id == id);
		if(cat_risques.length > 0){
			commentValue = cat_risques[0].commentaire;
		}
		return commentValue;
	  }
  
	ngOnDestroy() {
			this.subscriptions.forEach(sb => sb.unsubscribe());
	}
	
	goBackWithId() {
			const url = `/analyses-risque/list`;
			this.router.navigateByUrl(url, { 
				relativeTo: this.activatedRoute 
			});
	}

}
