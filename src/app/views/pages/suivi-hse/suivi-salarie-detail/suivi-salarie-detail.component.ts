import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, ControlContainer, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonnelService } from '@app/core/services';
import { NgxPermissionsService } from 'ngx-permissions';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import {MatDatepicker} from '@angular/material/datepicker';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { Personnel } from '@app/core/models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SuiviSalarieEditComponent } from '../suivi-salarie-edit/suivi-salarie-edit.component';

const moment = _rollupMoment || _moment;

@Component({
  selector: 'tf-suivi-salarie-detail',
  templateUrl: './suivi-salarie-detail.component.html',
  styleUrls: ['./suivi-salarie-detail.component.scss']
})
export class SuiviSalarieDetailComponent implements OnInit, OnDestroy {

  salarie: Personnel;
	salarieForm: FormGroup;
	// allRoles: Role[];
	loaded = false;
	editMode: boolean = false;
	// Private properties
  private subscriptions: Subscription[] = [];

  year = new FormControl(moment());

  constructor(
    private activatedRoute: ActivatedRoute,
		private router: Router,
		private salarieFB: FormBuilder,
    private personnelService: PersonnelService,
    private modalService: NgbModal,
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
          this.getSalarie(id);
        } else {
          this.router.navigateByUrl('/suivi-hse/list');
        }
      }
    );
  }

  ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}

  async getSalarie(salarieId){
		try {
      var res = await this.personnelService
      .getPersonnelByYear(
        salarieId,
        this.year.value.year()
      ).toPromise();
			this.salarie = res.result.data;
			this.cdr.markForCheck();
		} catch (error) {
			console.error(error);
		}
  }
  
  closeDatePicker(chosenYear: Date, datepicker: MatDatepicker<any>) {
    datepicker.close();
    this.year.setValue(moment(chosenYear));
    this.getSalarie(this.salarie.id);
  }

  editMetrics(){
    const modalRef = this.modalService.open(SuiviSalarieEditComponent, {size: 'xl',scrollable: true,centered : true});
    modalRef.componentInstance.salarie = this.salarie;
    modalRef.componentInstance.year = this.year.value.year();
    modalRef.result.then((result) => {
      if (result) {
        this.getSalarie(this.salarie.id);
      }
    }, (reason) => {
      
    });
  }

  goBackWithId() {
		const url = `/suivi-hse/list`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
  }

}
