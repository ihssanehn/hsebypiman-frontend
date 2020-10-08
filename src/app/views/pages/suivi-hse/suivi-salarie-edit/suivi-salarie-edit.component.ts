import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { Personnel, FollowUpPeriod } from '@app/core/models';
import { FormGroup, FormControl, FormBuilder, FormArray } from '@angular/forms';
import { Subscription } from 'rxjs';
import moment from 'moment';
import { Router, ActivatedRoute } from '@angular/router';
import { PersonnelService } from '@app/core/services';
import { NgxPermissionsService } from 'ngx-permissions';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import Swal from 'sweetalert2';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'tf-suivi-salarie-edit',
  templateUrl: './suivi-salarie-edit.component.html',
  styleUrls: ['./suivi-salarie-edit.component.scss']
})
export class SuiviSalarieEditComponent implements OnInit {

  @Input() public salarie: Personnel;
  @Input() public periodId: Number;

	// allRoles: Role[];
	loaded = false;
  metricForm: FormGroup;
  formloading: boolean = false;
	// Private properties
  private subscriptions: Subscription[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
		private router: Router,
		private fb: FormBuilder,
    private salarieService: PersonnelService,
    public activeModal: NgbActiveModal,
		private cdr: ChangeDetectorRef,
    private permissionsService : NgxPermissionsService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.createForm();
    if(this.salarie){
      this.patchCatMetrics(this.salarie.metricsTree);
      this.patchForm(this.salarie.metricsTree);
    }
  }

  createForm() {
    this.metricForm = this.fb.group({
      period_id: [this.periodId],
      items: this.fb.array([])
    })

		this.loaded = true;
  }

  calculateGlobalRating(list){
    const sum = list.reduce((acc, cur) => acc + Number(cur.rating),0);
    const avg = (sum / list.length);
    return avg;
  }

  ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}

  patchCatMetrics(catMetricsTree){
    catMetricsTree.forEach(item => {
      item.catMetricsList.forEach(catMetric => {
        var is_editable = false;
        catMetric.metrics.forEach(metric => {
          if(metric.is_editable)
            is_editable = true;
        });
        catMetric.is_editable = is_editable;
      });
    });
  }

  patchForm(item){
    if(item.length > 0){
      const catMetricsTreeFormArray: FormArray = this.metricForm.get('items') as FormArray;

      item.forEach((metricTree, i) => {
        let catMetricsArrayFB = []

        metricTree.catMetricsList.forEach((element, i) => {
          let metricsArrayFB = []

          element.metrics.forEach(metric_item => {
            const pivot_value = metric_item.pivot ? metric_item.pivot.value : null;
            var metric = this.fb.group({
              'id': [metric_item.id],
              'libelle': [metric_item.short_libelle],
              'pivot': this.fb.group({
                'value':[{value:pivot_value, disabled:false}]
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

          catMetricsArrayFB.push(cat);
        })

        var catMetricItem = this.fb.group({
          'id': [metricTree.id],
          'libelle': [metricTree.libelle],
          'code': [metricTree.code],
          'catMetricsList': this.fb.array(catMetricsArrayFB)
        })

        catMetricsTreeFormArray.push(catMetricItem);
      })
    }
  }

  getMetric(metric_id, cat_index, parent_cat_index): FormGroup {
    const tree = (this.metricForm.get('items') as FormArray).at(parent_cat_index) as FormArray;
    if (!tree) return null; 
    const metrics = (tree.get('catMetricsList') as FormArray).at(cat_index) as FormArray;
    if (!metrics) return null; 
    const qIdx = metrics.get('metrics').value.map(metric => { return metric.id }).indexOf(metric_id);
    const q = (metrics.get('metrics') as FormArray).at(qIdx) as FormGroup;
    return q;
  }

  getPivot(metric_id, cat_index, parent_cat_index): FormGroup {
    const metric = this.getMetric(metric_id, cat_index, parent_cat_index);
    if (!metric) return null;
    const pivot = metric.get('pivot') as FormGroup;
    if (!pivot) return null;
    return pivot;
  }

  onCancel(){
    this.activeModal.close();
  }

  onSubmit(){
    try {
      let form = {...this.metricForm.getRawValue()};
      form.period_id = this.periodId;

      this.salarieService.setMetrics(this.salarie.id,form)
        .toPromise()
        .then((visite) => {
          this.cdr.markForCheck();
          
          Swal.fire({
            icon: 'success',
            title: this.translate.instant("SUIVI_HSE.NOTIF.DATAS_UPDATED.TITLE"),
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            this.activeModal.close(true);
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

}
