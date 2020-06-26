import { Component, OnInit, AfterViewInit, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DateFrToEnPipe } from '@app/core/_base/layout';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'tf-salarie-filters',
  templateUrl: './salarie-filters.component.html',
  styleUrls: ['./salarie-filters.component.scss']
})
export class SalarieFiltersComponent implements  OnInit, AfterViewInit {

  @Output() change = new EventEmitter();

  filterForm: FormGroup;
  loading = false;
  hidden = true;
  data: boolean = false;
  fonctions: Object[];

  constructor(
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
    //this.getFonctions();
    this.initFiltersForm();
    this.filterForm.valueChanges.pipe(
      debounceTime(500)
    ).subscribe(data => this.search(data));
  }

  ngAfterViewInit(){
  }

  initFiltersForm(){
    this.filterForm = this.fb.group({
      fonction_id:[null],
      score_min:[null],
      score_max:[null],      
      created_at_start:[null],
      created_at_end:[null]
    })
  }

  search(filters: any): void {
    var filter = {...this.filterForm.getRawValue()}
    this.change.emit(filter);
  }

  formHasValue(key){
    return this.filterForm.get(key).value ? true:false;
  }
  
  clearValue(key){
    this.filterForm.get(key).patchValue(null);
  }
 
}
