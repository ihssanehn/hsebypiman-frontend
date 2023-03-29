import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Formation } from '@app/core/models';
import { FormationService } from '@app/core/services';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'tf-formation-detail',
  templateUrl: './formation-detail.component.html',
  styleUrls: ['./formation-detail.component.scss']
})
export class FormationDetailComponent implements OnInit, OnDestroy {

  formation: Formation;
  subscriptions: Subscription[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
		private router: Router,
		public dialog: MatDialog,
		private formationService: FormationService,
		private translate: TranslateService,
		private cdr: ChangeDetectorRef,
		iconRegistry: MatIconRegistry, 
		private _sanitizer: DomSanitizer,
  ) { 
		iconRegistry.addSvgIcon('status-encours',_sanitizer.bypassSecurityTrustResourceUrl('./assets/media/hse-svg/encours.svg'));
		iconRegistry.addSvgIcon('status-termine',_sanitizer.bypassSecurityTrustResourceUrl('./assets/media/hse-svg/termine.svg'));
	}

  ngOnInit() {
    const routeSubscription = this.activatedRoute.params.subscribe(
      async params => {
        const id = params.id;
        if (id) {
          this.getFormation(id);
        } else {
          this.router.navigateByUrl('/formations/list');
        }
      }
    );
  }

  ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}

  async getFormation(formationId: number){
		try {
			var res = await this.formationService.get(formationId).toPromise();
			this.formation = res.result.data;
			this.cdr.markForCheck();
		} catch (error) {
			console.error(error);
		}
	}

  goBackWithId() {
		const url = `/formations/list`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

  refreshFormation(id: number) {
		let url = this.router.url;
		url = `/formations/edit/${id}`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

    editFormation(id){
		this.router.navigateByUrl('admin/formations/edit/'+id);
	}

	deleteFormation(id){
		Swal.fire({
			title: this.translate.instant("NOTIF.FEATURE_NOT_IMPLEMENTED.TITLE"),
			showConfirmButton: false,
      		timer: 1500
		})
	}

}
