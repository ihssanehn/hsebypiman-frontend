import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, ControlContainer, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FlashInfoService } from '@app/core/services';
import { NgxPermissionsService } from 'ngx-permissions';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import {MatDatepicker} from '@angular/material/datepicker';
import { FlashInfo } from '@app/core/models/flashinfo.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
		iconRegistry: MatIconRegistry, 
		sanitizer: DomSanitizer
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
	giveAccess(){
		this.router.navigateByUrl('/admin/flash-infos/edit/'+this.flashinfo.id);
  }

  goBack() {
		this.router.navigateByUrl('/admin/flash-infos/list');
  }

}
