import { ChangeDetectorRef, Component, OnInit, EventEmitter, Output, Input, forwardRef, AfterViewInit } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import { ActionService, TypeService, StatusService, EntrepriseService, PersonnelService } from '@app/core/services';
import { Action, Type, Status, Entreprise } from '@app/core/models';
import { AuthService, User } from '@app/core/auth';
import moment from 'moment';
import { debounceTime, map } from 'rxjs/operators';
import { DateEnToFrPipe, DateFrToEnPipe } from '@app/core/_base/layout';


@Component({
  selector: 'tf-action-filters',
  templateUrl: './action-filters.component.html',
  styleUrls: ['./action-filters.component.scss'],
})

export class ActionFiltersComponent implements OnInit, AfterViewInit
{
  
  filterForm: FormGroup;
  loading = false;
  hidden = true;
  data: boolean = false;
  users: User[];
  status: Status[];
  types: Type[];
  statuses;

  @Output() change = new EventEmitter();
  constructor(
    private statusService: StatusService,
    private actionService:ActionService, 
    private entrepriseService:EntrepriseService, 
    private typeService:TypeService,
    private userService:PersonnelService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private dateFrToEnPipe:DateFrToEnPipe,
		iconRegistry: MatIconRegistry, 
    sanitizer: DomSanitizer,
  ) {
		iconRegistry.addSvgIcon(
      'search',sanitizer.bypassSecurityTrustResourceUrl('./assets/media/hse-svg/search.svg'));
  }

  ngOnInit(){
    this.getStatus();
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

  async getStatus(){
    var res = await this.statusService.getAllFromModel('Action').toPromise();
    this.status = res.result.data;
    // var status_termine = this.status.filter(x=>x.code == 'ENCOURS')[0].id;
    // this.filterForm.patchValue({'status_id':status_termine}, {onlySelf: true, emitEvent: true});
    this.cdr.markForCheck();
  }

  async getTypes(){
    var res = await this.typeService.getAllFromModel('Action').toPromise();
    this.types = res.result.data;
    this.cdr.markForCheck();
  }
  
  initFiltersForm(){
    this.filterForm = this.fb.group({
      pilote_id:[null],
      status_id:[null],
      type_id:[null],
      efficacite_min:[null],
      efficacite_max:[null],
      delai_start:[null],
      delai_end:[null],
      created_at_start:[null],
      created_at_end:[null],
      date_realisation_start:[null],
      date_realisation_end:[null],
    })
  }
 
  search(filters: any): void {
    var filter = {...this.filterForm.getRawValue()}
    filter.delai_start = this.dateFrToEnPipe.transform(filter.delai_start);
    filter.delai_end = this.dateFrToEnPipe.transform(filter.delai_end);
    filter.date_realisation_start = this.dateFrToEnPipe.transform(filter.date_realisation_start);
    filter.date_realisation_end = this.dateFrToEnPipe.transform(filter.date_realisation_end);
    filter.created_at_start = this.dateFrToEnPipe.transform(filter.created_at_start);
    filter.created_at_end = this.dateFrToEnPipe.transform(filter.created_at_end);
    this.change.emit(filter);
  }

  formHasValue(key){
    return this.filterForm.get(key).value ? true:false;
  }
  
  clearValue(key){
    this.filterForm.get(key).patchValue(null);
  }

}
