import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from "rxjs";
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { DemandeEpisService } from '@app/core/services';
import { DemandeEpis } from '@app/core/models';

@Component({
  selector: 'tf-demande-epis-detail',
  templateUrl: './demande-epis-detail.component.html',
  styleUrls: ['./demande-epis-detail.component.scss']
})
export class DemandeEpisDetailComponent implements OnInit, OnDestroy {
  demande_epi: DemandeEpis;
	private subscriptions: Subscription[] = [];

	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private translate:TranslateService,
		private cdr: ChangeDetectorRef,
		private demandeEpisService: DemandeEpisService,
	) {}

	ngOnInit() {
		const routeSubscription = this.activatedRoute.params.subscribe(async params => {
			this.getDemandeEpi(params.id);
		});

		this.subscriptions.push(routeSubscription);
	}


	async getDemandeEpi(id){
		await this.demandeEpisService.get(id).toPromise().then(res=>{
			this.demande_epi = res;
			this.cdr.markForCheck();
		})
	}

	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}

	editDemandeEpis(){
		this.router.navigateByUrl('materiel/demandes-epis/edit/'+this.demande_epi.id);
	}
	cancelDemandeEpis() {
		Swal.fire({
				icon: 'warning',
				title: this.translate.instant("DEMANDES_EPIS.NOTIF.DEMANDE_CANCEL_CONFIRMATION.TITLE"),
				text: this.translate.instant("DEMANDES_EPIS.NOTIF.DEMANDE_CANCEL_CONFIRMATION.LABEL"),
				showConfirmButton: true,
				showCancelButton: true,
				cancelButtonText: this.translate.instant("ACTION.CANCEL"),
				confirmButtonText: this.translate.instant("ACTION.DELETE"),
			}).then(async response => {
				if (response.value) {

					this.demandeEpisService.delete(this.demande_epi.id).toPromise().then(res=>{
						Swal.fire({
							title: this.translate.instant("DEMANDES_EPIS.NOTIF.DEMANDE_CANCELED.TITLE"),
							showConfirmButton: false,
							icon: 'success',
							timer: 1500
						}).then(() => {
							this.router.navigateByUrl('/materiel/demandes-epis/list');
						});
					})
				}
			})
	}
}
