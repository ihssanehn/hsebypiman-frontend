import { Component, OnInit, AfterViewInit, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DateFrToEnPipe } from '@app/core/_base/layout';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { debounceTime } from 'rxjs/operators';
import { FonctionService } from '@app/core/services';
import { Type } from '@app/core/models/type.model';

@Component({
  selector: 'tf-salarie-filters',
  templateUrl: './salarie-filters.component.html',
  styleUrls: ['./salarie-filters.component.scss']
})
export class SalarieFiltersComponent implements  OnInit {

  @Output() change = new EventEmitter();

  filterForm: FormGroup;
  loading = false;
  hidden = true;
  data: boolean = false;
  fonctions: Type[];

  constructor(
    private fonctionService: FonctionService,
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
    this.initFiltersForm();
    this.filterForm.valueChanges.pipe(
      debounceTime(500)
    ).subscribe(data => this.search(data));
  }

  async getFonctions(){
    var res = await this.fonctionService.getList().toPromise();
    this.fonctions = res.result.data;
    this.cdr.markForCheck();
  }

  initFiltersForm(){
    this.filterForm = this.fb.group({
      fonction_id:[null],    
      entry_at_start:[null],
      entry_at_end:[null]
    })
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
