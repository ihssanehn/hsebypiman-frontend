import { ChangeDetectorRef, Component, OnInit, EventEmitter, Output, Input, forwardRef, AfterViewInit } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import { RemonteeService, TypeService, StatusService, PersonnelService } from '@app/core/services';
import { Remontee, Type } from '@app/core/models';
import { AuthService, User } from '@app/core/auth';
import * as moment from 'moment';
import { debounceTime, map } from 'rxjs/operators';
import { DateEnToFrPipe, DateFrToEnPipe } from '@app/core/_base/layout';



@Component({
  selector: 'tf-remontee-filters',
  templateUrl: './remontee-filters.component.html',
  styleUrls: ['./remontee-filters.component.scss'],
})

export class RemonteeFiltersComponent implements OnInit, AfterViewInit
{
  
  filterForm: FormGroup;
  loading = false;
  hidden = true;
  data: boolean = false;
  users: User[];
  types: Type[];

  @Output() change = new EventEmitter();
  constructor(
    private typeService:TypeService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private userService:PersonnelService,
    private dateFrToEnPipe:DateFrToEnPipe,
		iconRegistry: MatIconRegistry, 
    sanitizer: DomSanitizer,
  ) {
		iconRegistry.addSvgIcon(
      'search',sanitizer.bypassSecurityTrustResourceUrl('./assets/media/hse-svg/search.svg'));
  }

  ngOnInit(){
    this.getUsers();
    this.getTypes();
    this.initFiltersForm();
    this.filterForm.valueChanges.pipe(
      debounceTime(500)
    ).subscribe(data => this.search(data));
  }
  
  ngAfterViewInit(){
  }

  // Load ressources needed
  async getUsers(){
    var res = await this.userService.getList().toPromise();
    this.users = res.result.data;
    this.cdr.markForCheck();
  }
  async getTypes(){
    var res = await this.typeService.getAllFromModel('Remontee').toPromise();
    this.types = res.result.data;
    this.cdr.markForCheck();
  }
  
  initFiltersForm(){
    this.filterForm = this.fb.group({
      type_id:[null],
      creator_id:[null],
      date_creation_start:[null],
      date_creation_end:[null],
    })
  }
 
  search(filters: any): void {
    var filter = {...this.filterForm.getRawValue()}
    filter.date_creation_start = this.dateFrToEnPipe.transform(filter.date_creation_start);
    filter.date_creation_end = this.dateFrToEnPipe.transform(filter.date_creation_end);
    this.change.emit(filter);
  }

  formHasValue(key){
    return this.filterForm.get(key).value ? true:false;
  }

  clearValue(key){
    this.filterForm.get(key).patchValue(null);
  }

}
