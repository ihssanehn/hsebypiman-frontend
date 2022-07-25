import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Formation, Habilitation } from '@app/core/models';
import { FormationService, HabilitationService } from '@app/core/services';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'tf-habilitation-detail',
  templateUrl: './habilitation-detail.component.html',
  styleUrls: ['./habilitation-detail.component.scss']
})
export class HabilitationDetailComponent implements OnInit, OnDestroy {

	habilitation: Habilitation;
	subscriptions: Subscription[] = [];

  	constructor(
    	private activatedRoute: ActivatedRoute,
		private router: Router,
		public dialog: MatDialog,
		private habilitationService: HabilitationService,
		private translate: TranslateService,
		private cdr: ChangeDetectorRef
	) { 
	}

	ngOnInit() {
		const routeSubscription = this.activatedRoute.params.subscribe(
		async params => {
			const id = params.id;
			if (id) {
				this.getHabilitation(id);
			} else {
				this.router.navigateByUrl('/habilitations/list');
			}
		}
		);
	}

  	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}

  	async getHabilitation(id: number){
		try {
			var res = await this.habilitationService.get(id).toPromise();
			this.habilitation = res.result.data;
			this.cdr.markForCheck();
		} catch (error) {
			console.error(error);
		}
	}

  	goBackWithId() {
		const url = `/habilitations/list`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

  	refreshHabilitation(id: number) {
		let url = this.router.url;
		url = `/habilitations/edit/${id}`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

  	editHabilitation(id: number){
		this.router.navigateByUrl('admin/habilitations/edit/'+id);
	}

	deleteHabilitation(id: number){
		Swal.fire({
			title: this.translate.instant("NOTIF.FEATURE_NOT_IMPLEMENTED.TITLE"),
			showConfirmButton: false,
      		timer: 1500
		})
	}

}
