import { ChangeDetectorRef, Component, OnInit, EventEmitter, Output, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import { TypeService } from '@app/core/services';
import { Type, Status } from '@app/core/models';
import { User } from '@app/core/auth';
import { debounceTime } from 'rxjs/operators';


@Component({
  selector: 'tf-entreprise-filters',
  templateUrl: './entreprise-filters.component.html',
  styleUrls: ['./entreprise-filters.component.scss'],
})

export class EntrepriseFiltersComponent implements OnInit, AfterViewInit
{
  
  filterForm: FormGroup;
  loading = false;
  hidden = true;
  data: boolean = false;
  users: User[];
  status: Status[];
  types: Type[];
  clients: String[];
  statuses;

  @Output() change = new EventEmitter();
  constructor(
    private typeService:TypeService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
		iconRegistry: MatIconRegistry, 
    sanitizer: DomSanitizer,
  ) {
		iconRegistry.addSvgIcon(
      'search',sanitizer.bypassSecurityTrustResourceUrl('./assets/media/hse-svg/search.svg'));
  }

  ngOnInit(){
    this.getTypes();
    this.initFiltersForm();
    this.filterForm.valueChanges.pipe(
      debounceTime(500)
    ).subscribe(data => this.search(data));
  }
  
  ngAfterViewInit(){
  }

  
  async getTypes(){
    var res = await this.typeService.getAllFromModel('Entreprise').toPromise();
    this.types = res.result.data;
    this.cdr.markForCheck();
  }
  
  initFiltersForm(){
    this.filterForm = this.fb.group({
      type_id:[null],
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
