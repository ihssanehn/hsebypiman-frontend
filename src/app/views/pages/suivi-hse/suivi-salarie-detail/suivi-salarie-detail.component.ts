import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, ControlContainer, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonnelService, PeriodService } from '@app/core/services';
import { NgxPermissionsService } from 'ngx-permissions';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import {MatDatepicker} from '@angular/material/datepicker';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { Personnel, FollowUpPeriod } from '@app/core/models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SuiviSalarieEditComponent } from '../suivi-salarie-edit/suivi-salarie-edit.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'tf-suivi-salarie-detail',
  templateUrl: './suivi-salarie-detail.component.html',
  styleUrls: ['./suivi-salarie-detail.component.scss']
})
export class SuiviSalarieDetailComponent implements OnInit, OnDestroy {

  salarie: Personnel;
  period: FollowUpPeriod;
  selectedPeriodId: Number;
  periodList: FollowUpPeriod[];
	salarieForm: FormGroup;
	// allRoles: Role[];
	loaded = false;
	editMode: boolean = false;
	// Private properties
  private subscriptions: Subscription[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
		private router: Router,
		private salarieFB: FormBuilder,
    private personnelService: PersonnelService,
    private periodService: PeriodService,
    private modalService: NgbModal,
		private cdr: ChangeDetectorRef,
		private permissionsService : NgxPermissionsService,
		iconRegistry: MatIconRegistry, 
		sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.getPeriods();
    const routeSubscription = this.activatedRoute.params.subscribe(
      async params => {
        const id = params.id;
        if (id) {
          await this.periodService.getLatest().toPromise()
          .then((res:any) => {
            if(res){
              this.period = res.result.data;
              if(this.period){
                this.selectedPeriodId = this.period.id;
              }else{
                this.selectedPeriodId = 0;
              }
              this.getSalarie(id);
            }
          });
         
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
      .getPersonnelByPeriod(
        salarieId,
        this.selectedPeriodId
      ).toPromise();
			this.salarie = res.result.data;
			this.cdr.markForCheck();
		} catch (error) {
			console.error(error);
		}
  }

  async getPeriods(){
    var res = await this.periodService.getList().toPromise();
    this.periodList = res.result.data;
    this.cdr.markForCheck();
  }

  editMetrics(){
    if(this.selectedPeriodId){
      const modalRef = this.modalService.open(SuiviSalarieEditComponent, {size: 'xl',scrollable: true,centered : true});
      modalRef.componentInstance.salarie = this.salarie;
      modalRef.componentInstance.periodId = this.selectedPeriodId;
      modalRef.result.then((result) => {
        if (result) {
          this.getSalarie(this.salarie.id);
        }
      }, (reason) => {
        
      });
    }else{
      Swal.fire({
        title: 'Aucune période n\'a été sélectionnée ! Veuillez en ajouter une à partir de l\'onglet Objectifs',
        showConfirmButton: false,
        timer: 2000
      })
    }
  }

  goBackWithId() {
		const url = `/suivi-hse/list`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
  }

  changePeriod(selectedPeriod)
  {
    this.selectedPeriodId = selectedPeriod;
    this.getSalarie(this.salarie.id);
  }

}
