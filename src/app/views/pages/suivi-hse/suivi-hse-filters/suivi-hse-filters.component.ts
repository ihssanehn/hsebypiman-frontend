import { Component, OnInit, AfterViewInit, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DateFrToEnPipe } from '@app/core/_base/layout';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { debounceTime } from 'rxjs/operators';
import { FonctionService, PeriodService } from '@app/core/services';
import { Type } from '@app/core/models/type.model';
import { FollowUpPeriod } from '@app/core/models';

@Component({
  selector: 'tf-suivi-hse-filters',
  templateUrl: './suivi-hse-filters.component.html',
  styleUrls: ['./suivi-hse-filters.component.scss']
})
export class SuiviHseFiltersComponent implements  OnInit {

  @Output() change = new EventEmitter();

  filterForm: FormGroup;
  loading = false;
  hidden = true;
  data: boolean = false;
  fonctions: Type[];
  periodList: FollowUpPeriod[];
  period: FollowUpPeriod;
  selectedPeriodId: Number;

  constructor(
    private fonctionService: FonctionService,
    private periodService: PeriodService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private dateFrToEnPipe:DateFrToEnPipe,
		iconRegistry: MatIconRegistry, 
    sanitizer: DomSanitizer,
  ) {
    iconRegistry.addSvgIcon(
      'search',sanitizer.bypassSecurityTrustResourceUrl('./assets/media/hse-svg/search.svg'));
  }

  ngOnInit() {
    this.getFonctions();
    this.getPeriods();
    this.getLatestPeriod();

  }

  async getFonctions(){
    var res = await this.fonctionService.getList().toPromise();
    this.fonctions = res.result.data;
    this.cdr.markForCheck();
  }

  async getLatestPeriod(){
    var res = await this.periodService.getLatest().toPromise();
    this.period = res.result.data;
    if(this.period){
      this.selectedPeriodId = this.period.id;
    }
    this.initFiltersForm();
    this.cdr.markForCheck();
  }

  async getPeriods(){
    var res = await this.periodService.getList().toPromise();
    this.periodList = res.result.data;
    this.cdr.markForCheck();
  }

  initFiltersForm(){
    this.filterForm = this.fb.group({
      fonction_id:[null],    
      period_id:[this.selectedPeriodId],    
      entry_at_start:[null],
      entry_at_end:[null]
    });
    
    this.filterForm.valueChanges.pipe(
      debounceTime(500)
    ).subscribe(data => this.search(data));
  }

  search(filters: any): void {
    var filter = {...this.filterForm.getRawValue()}
    filter.entry_at_start = this.dateFrToEnPipe.transform(filter.entry_at_start);
    filter.entry_at_end = this.dateFrToEnPipe.transform(filter.entry_at_end);
    this.change.emit(filter);
  }

  formHasValue(key){
    return this.filterForm.get(key).value ? true:false;
  }
  
  clearValue(key){
    this.filterForm.get(key).patchValue(null);
  }
 
}
