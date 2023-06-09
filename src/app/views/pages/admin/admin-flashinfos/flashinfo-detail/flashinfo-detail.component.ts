import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FlashInfoService } from '@app/core/services';
import { NgxPermissionsService } from 'ngx-permissions';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { FlashInfo } from '@app/core/models/flashinfo.model';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';

// import { SalarieEditComponent } from '../salarie-edit/salarie-edit.component';

@Component({
  selector: 'tf-flashinfo-detail',
  templateUrl: './flashinfo-detail.component.html',
  styleUrls: ['./flashinfo-detail.component.scss']
})
export class FlashInfoDetailComponent implements OnInit, OnDestroy {

  flashinfo: FlashInfo;
	flashinfoForm: FormGroup;
	// allRoles: Role[];
	loaded = false;
	editMode: boolean = false;
	// Private properties
  private subscriptions: Subscription[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
		private router: Router,
		private salarieFB: FormBuilder,
    private FlashInfoService: FlashInfoService,
		private cdr: ChangeDetectorRef,
		private permissionsService : NgxPermissionsService,
    private translate: TranslateService,
		iconRegistry: MatIconRegistry, 
    sanitizer: DomSanitizer,
  ) {}

  ngOnInit() {
    const routeSubscription = this.activatedRoute.params.subscribe(
      async params => {
        const id = params.id;
        if (id) {
          this.getFlashInfo(id);
        } else {
          this.router.navigateByUrl('/admin/flash-infos/list');
        }
      }
    );
  }

  ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}

  async getFlashInfo(flashinfoId){
		try {
      var res = await this.FlashInfoService.get(flashinfoId).toPromise();
			this.flashinfo = res.result.data;
			this.cdr.markForCheck();
		} catch (error) {
			console.error(error);
		}
  }

	editFlashInfo(){
		this.router.navigateByUrl('/admin/flash-infos/edit/'+this.flashinfo.id);
  }
  deleteFlashInfo(){
    Swal.fire({
      icon: 'warning',
      title: this.translate.instant("FLASHINFOS.NOTIF.FLASHINFO_DELETE_CONFIRMATION.TITLE"),
      text: this.translate.instant("FLASHINFOS.NOTIF.FLASHINFO_DELETE_CONFIRMATION.LABEL"),
      showConfirmButton: true,
      showCancelButton: true,
      cancelButtonText: this.translate.instant("ACTION.CANCEL"),
      confirmButtonText: this.translate.instant("ACTION.DELETE"),
    }).then(async response => {
      if (response.value) {

        this.FlashInfoService.delete(this.flashinfo.id).toPromise().then(res=>{
          Swal.fire({
            title: this.translate.instant("FLASHINFOS.NOTIF.FLASHINFO_DELETED.TITLE"),
            showConfirmButton: false,
            icon: 'success',
            timer: 1500
          }).then(()=>{
            this.router.navigateByUrl('/admin/flash-infos/list');
          })
        })
        // this.saveForm(form);


      }
    })
  }
	giveAccess(){
		this.router.navigateByUrl('/admin/flash-infos/edit/'+this.flashinfo.id);
  }

  goBack() {
		this.router.navigateByUrl('/admin/flash-infos/list');
  }

}
