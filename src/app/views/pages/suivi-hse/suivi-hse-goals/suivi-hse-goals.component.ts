import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CatMetricService, GoalService, PeriodService } from '@app/core/services';
import { CatMetric, FollowUpPeriod } from '@app/core/models';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SuiviHsePeriodsAddComponent } from './suivi-hse-periods-add/suivi-hse-periods-add.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'tf-suivi-hse-goals',
  templateUrl: './suivi-hse-goals.component.html',
  styleUrls: ['./suivi-hse-goals.component.scss']
})
export class SuiviHseGoalsComponent implements OnInit {

  catMetricsList: CatMetric[];
  period: FollowUpPeriod;
  selectedPeriodId: Number;
  periodList: FollowUpPeriod[];
  goalForm: FormGroup;
  formloading: boolean = false;
  loaded = false;


  constructor(
    private catMetricService: CatMetricService,
    private goalService: GoalService,
    private periodService: PeriodService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private location: Location,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService
  ) { }

  ngOnInit() {
    this.getPeriods();
    this.getLatestPeriod();
  }

  refreshForm() {
    this.goalForm = this.fb.group({
      period_id: [this.selectedPeriodId, Validators.required],
      items: this.fb.array([])
    })

    this.loaded = true;
  }

  async getLatestPeriod(){
    var res = await this.periodService.getLatest().toPromise();
    this.period = res.result.data;
    if(this.period){
      this.selectedPeriodId = this.period.id;
    }
    this.refreshForm();
    this.getCatMetrics();
    this.cdr.markForCheck();
  }

  async getCatMetrics(){
    var res = await this.catMetricService
      .getAll({
        has_goal:true,
        period_id:this.selectedPeriodId
      }).toPromise();
    this.catMetricsList = res.result.data;
    this.refreshForm();
    this.patchForm(res.result.data);
    this.cdr.markForCheck();
  }

  async getPeriods(){
    var res = await this.periodService.getList().toPromise();
    this.periodList = res.result.data;
    this.cdr.markForCheck();
  }

  patchForm(item){
    if(item.length > 0){
      const catMetricsListFormArray: FormArray = this.goalForm.get('items') as FormArray;

      item.forEach((element, i) => {
        let metricsArrayFB = []

        element.metrics.forEach(metric_item => {
          const goal_value = metric_item.year_goal ? metric_item.year_goal.value : null;
          var metric = this.fb.group({
            'id': [metric_item.id],
            'libelle': [metric_item.short_libelle],
            'goal': this.fb.group({
              'value':[{value:goal_value, disabled:false}]
            })
          });

          metricsArrayFB.push(metric);
        })

        var cat = this.fb.group({
          'id': [element.id],
          'libelle': [element.description],
          'code': [element.code],
          'metrics': this.fb.array(metricsArrayFB)
        })

        catMetricsListFormArray.push(cat);
      })
    }
  }

  getMetric(metric_id, cat_index): FormGroup {
    const metrics = (this.goalForm.get('items') as FormArray).at(cat_index) as FormArray;
    if (!metrics) return null; 
    const qIdx = metrics.get('metrics').value.map(metric => { return metric.id }).indexOf(metric_id);
    const q = (metrics.get('metrics') as FormArray).at(qIdx) as FormGroup;
    return q;
  }

  getGoal(metric_id, cat_index): FormGroup {
    const metric = this.getMetric(metric_id, cat_index);
    if (!metric) return null;
    const goal = metric.get('goal') as FormGroup;
    if (!goal) return null;
    return goal;
  }

  onSubmit(){
    try {
      let form = {...this.goalForm.getRawValue()};
      form.period_id = this.selectedPeriodId;
      this.goalService.create(form)
        .toPromise()
        .then((visite) => {
          this.cdr.markForCheck();
          
          Swal.fire({
            icon: 'success',
            title: this.translate.instant("SUIVI_HSE.NOTIF.GOAL_UPDATED.TITLE"),
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            //this.location.back();
          });
        })
        .catch(err =>{ 

          Swal.fire({
            icon: 'error',
            title: this.translate.instant("NOTIF.INCOMPLETE_FORM.TITLE"),
            showConfirmButton: false,
            timer: 1500
          });

        });
        
      this.cdr.markForCheck();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  onCancel(){
    this.location.back();
  }

  changePeriod(selectedPeriod)
  {
    this.selectedPeriodId = selectedPeriod;
    this.getCatMetrics();
  }

  openNewPeriodModal()
  {
    const modalRef = this.modalService.open(SuiviHsePeriodsAddComponent, {size: 'lg',scrollable: true,centered : true});
    modalRef.result.then((result) => {
      if (result) {
        this.selectedPeriodId = result.id;
        this.getPeriods();
        this.getCatMetrics();
      }
    }, (reason) => {
      
    });
  }

}
