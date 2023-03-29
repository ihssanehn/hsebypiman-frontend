import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { CatHabilitationService } from '@app/core/services';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'tf-habilitation-filters',
  templateUrl: './habilitation-filters.component.html',
  styleUrls: ['./habilitation-filters.component.scss']
})
export class HabilitationFiltersComponent implements OnInit {

  @Output() change = new EventEmitter();

  filterForm: FormGroup;
  catHabilitations: any[];
  catHabLoaded: boolean = false;

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private catHabilitationService: CatHabilitationService,
		iconRegistry: MatIconRegistry, 
    sanitizer: DomSanitizer,
  ) { 
    iconRegistry.addSvgIcon(
      'search',sanitizer.bypassSecurityTrustResourceUrl('./assets/media/hse-svg/search.svg'));
  }

  ngOnInit() {
    this.getCatHabilitations();
    this.initFiltersForm();
    this.filterForm.valueChanges.pipe(
      debounceTime(500)
    ).subscribe(data => this.search(data));
  }

  initFiltersForm(){
    this.filterForm = this.fb.group({
      categorie_id:[null]
    })
  }

  async getCatHabilitations(){
    this.catHabLoaded = false;
    var res = await this.catHabilitationService.getAll().toPromise();
    if(res){
      this.catHabilitations = res.result.data;
      this.catHabLoaded = true;
    }
    this.cdr.markForCheck();
  }

  search(filters: any): void {
    var filter = {...this.filterForm.getRawValue()}
    this.change.emit(filter);
  }

  formHasValue(key){
    return this.filterForm.get(key)? this.filterForm.get(key).value ? true:false: false;
  }
  
  clearValue(key){
    this.filterForm.get(key).patchValue(null);
  }

}
