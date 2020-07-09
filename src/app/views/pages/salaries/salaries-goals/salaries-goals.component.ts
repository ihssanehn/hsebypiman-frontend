import { Component, OnInit, ChangeDetectorRef, Optional, Inject } from '@angular/core';
import { CatMetricService, GoalService } from '@app/core/services';
import { CatMetric } from '@app/core/models';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import {MatDatepicker} from '@angular/material/datepicker';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';

const moment = _rollupMoment || _moment;

@Component({
  selector: 'tf-salaries-goals',
  templateUrl: './salaries-goals.component.html',
  styleUrls: ['./salaries-goals.component.scss']
})
export class SalariesGoalsComponent implements OnInit {

  catMetricsList: CatMetric[];
  goalForm: FormGroup;
  formloading: boolean = false;
  loaded = false;
  year = new FormControl(moment());

  constructor(
    private catMetricService: CatMetricService,
    private goalService: GoalService,
    private fb: FormBuilder,
    private location: Location,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.refreshForm();
    if(this.loaded) this.getCatMetrics();
  }

  refreshForm() {
    this.goalForm = this.fb.group({
      period: [moment()],
      items: this.fb.array([])
    })

		this.loaded = true;
  }

  async getCatMetrics(){
    var res = await this.catMetricService
      .getAll({
        has_goal:true,
        period:this.year.value.year()
      }).toPromise();
    this.catMetricsList = res.result.data;
    this.refreshForm();
    this.patchForm(res.result.data);
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
      form.period = this.year.value.year();
      this.goalService.create(form)
        .toPromise()
        .then((visite) => {
          this.cdr.markForCheck();
          
          Swal.fire({
            icon: 'success',
            title: 'Objectif mis à jour avec succès',
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            this.location.back();
          });
        })
        .catch(err =>{ 

          Swal.fire({
            icon: 'error',
            title: 'Echec! le formulaire est incomplet',
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

  closeDatePicker(chosenYear: Date, datepicker: MatDatepicker<any>) {
    datepicker.close();
    this.year.setValue(moment(chosenYear));
    this.getCatMetrics();
  }

}
