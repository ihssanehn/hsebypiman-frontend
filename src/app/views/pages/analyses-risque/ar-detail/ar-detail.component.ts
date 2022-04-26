import { Component, OnInit, ChangeDetectorRef, OnDestroy, Injector } from '@angular/core';
import { Ar, Chantier } from '@app/core/models';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ArService, ChantierService } from '@app/core/services';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'tf-ar-detail',
  templateUrl: './ar-detail.component.html',
  styleUrls: ['./ar-detail.component.scss']
})
export class ArDetailComponent implements OnInit, OnDestroy {

  	ar: Ar;
	chantier : Chantier;

	isExpanded = false;
	isDisableToggle = false;

	loaded = false;

	protected subscriptions: Subscription[] = [];
	
	protected activatedRoute: ActivatedRoute;
	protected cdr: ChangeDetectorRef;
	protected router: Router;
	protected chantierService: ChantierService;
	protected arService: ArService;
	protected translate: TranslateService;


	constructor(injector: Injector) {
		this.activatedRoute = injector.get(ActivatedRoute);
		this.router = injector.get(Router);
		this.arService = injector.get(ArService);
		this.cdr = injector.get(ChangeDetectorRef);
		this.chantierService = injector.get(ChantierService);
		this.translate = injector.get(TranslateService);
	}

	ngOnInit() {
		const routeSubscription = this.activatedRoute.params.subscribe(
			async params => {
				const id = params.id;
				if (id) {
					this.getAr(id);
				} else {
					this.router.navigateByUrl('/analyses-risque/list');
				}
			}
		);
		this.subscriptions.push(routeSubscription);
	}

	async getAr(arId: Number){
		try {
			var res = await this.arService.get(arId).toPromise();
			this.ar = res.result.data;
			this.chantier = this.ar.chantier
			this.cdr.markForCheck();
		} catch (error) {
			console.error(error);
		}
	}

	async getChantier(chantierId: Number){
		try {
			var res = await this.chantierService.get(chantierId).toPromise();
			this.chantier = res.result.data;
			this.cdr.markForCheck();
		} catch (error) {
			console.error(error);
		}
	}

	async deleteAr(arId){
		await this.arService.delete(arId).toPromise();
		Swal.fire({
			icon: 'success',
			title: this.translate.instant("ARS.NOTIF.AR_DELETED.TITLE"),
			showConfirmButton: false,
			timer: 1500
		});
		this.router.navigate(['/analyses-risque/list'], { relativeTo: this.activatedRoute });
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

	editAr(arId){
		this.router.navigate(['/analyses-risque/edit', arId], { relativeTo: this.activatedRoute });
	}

	signAr(arId){
		this.router.navigate(['/analyses-risque/sign', arId], { relativeTo: this.activatedRoute });
	}

	duplicateAr(){
		if(!this.ar.chantier.is_all_ars_archived){
			Swal.fire({
				icon: 'warning',
				title: this.translate.instant("ARS.HEAD.NOTIF.AR_ARCHIVED.TITLE"),
				html: "<p class='text-warning'><b>"+this.translate.instant("ARS.HEAD.NOTIF.AR_ARCHIVED.LABEL")+"</b></p><p>"+this.translate.instant("ARS.HEAD.NOTIF.AR_ARCHIVED.SUBLABEL")+"</p>",
				showConfirmButton: true,
				showCancelButton: true,
				cancelButtonText: this.translate.instant("ACTION.CANCEL"),
				confirmButtonText: this.translate.instant("ACTION.CONFIRM")
			}).then(async response => {
				if (response.value) {
					this.router.navigate(['analyses-risque/add'], {queryParams:{ar_id:this.ar.id}})
				}
			});
		}
	}

	exportPDF(arId){
		return this.arService.exportPDF(arId);
	}

}
