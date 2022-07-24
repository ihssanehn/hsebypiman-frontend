import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { User } from '@app/core/auth';
import { HabilitationService, PersonnelService } from '@app/core/services';
import { DateFrToEnPipe } from '@app/core/_base/layout';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'tf-formation-filters',
  templateUrl: './formation-filters.component.html',
  styleUrls: ['./formation-filters.component.scss']
})
export class FormationFiltersComponent implements OnInit {

  @Output() change = new EventEmitter();

  filterForm: FormGroup;
  loading: boolean = false;
  hidden: boolean = true;
  data: boolean = false;
  habilitations: any[];
  habLoaded: boolean = false;

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private dateFrToEnPipe: DateFrToEnPipe,
    private habilitationService: HabilitationService,
		iconRegistry: MatIconRegistry, 
    sanitizer: DomSanitizer,
  ) { 
    iconRegistry.addSvgIcon(
      'search',sanitizer.bypassSecurityTrustResourceUrl('./assets/media/hse-svg/search.svg'));
  }

  ngOnInit() {
    this.getHabilitations();
    this.initFiltersForm();
    this.filterForm.valueChanges.pipe(
      debounceTime(500)
    ).subscribe(data => this.search(data));
  }

  initFiltersForm(){
    this.filterForm = this.fb.group({
      habilitation_id:[null],
      date_debut:[null],
      date_fin:[null]
    })
  }

  async getHabilitations(){
    this.habLoaded = false;
    var res = await this.habilitationService.getAllList().toPromise();
    if(res){
      this.habilitations = res.result.data;
      this.habLoaded = true;
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
