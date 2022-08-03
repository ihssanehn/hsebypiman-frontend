import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from "rxjs";
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { RemonteeService } from '@app/core/services';

@Component({
  selector: 'tf-remontee-detail',
  templateUrl: './remontee-detail.component.html',
  styleUrls: ['./remontee-detail.component.scss']
})
export class RemonteeDetailComponent implements OnInit, OnDestroy {
  id: number;
	private subscriptions: Subscription[] = [];

	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private translate:TranslateService,
		private remonteeService: RemonteeService,
	) {}

	ngOnInit() {
		const routeSubscription = this.activatedRoute.params.subscribe(async params => {
			this.id = params.id;
		});

		this.subscriptions.push(routeSubscription);
	}

	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}

	editRemonte(id){
		this.router.navigateByUrl('remontees/edit/'+id);
	}
	deleteRemonte(remonteId) {
		Swal.fire({
				icon: 'warning',
				title: this.translate.instant("REMONTEES.NOTIF.REMONTEE_DELETE_CONFIRMATION.TITLE"),
				text: this.translate.instant("REMONTEES.NOTIF.REMONTEE_DELETE_CONFIRMATION.LABEL"),
				showConfirmButton: true,
				showCancelButton: true,
				cancelButtonText: this.translate.instant("ACTION.CANCEL"),
				confirmButtonText: this.translate.instant("ACTION.DELETE"),
			}).then(async response => {
				if (response.value) {

					this.remonteeService.delete(remonteId).toPromise().then(res=>{
						Swal.fire({
							title: this.translate.instant("REMONTEES.NOTIF.REMONTEE_DELETED.TITLE"),
							showConfirmButton: false,
							icon: 'success',
							timer: 1500
						}).then(() => {
							this.router.navigateByUrl('/remontees/list');
						});
					})
				}
			})
	}
}
