import { ChangeDetectorRef, Component, OnInit, EventEmitter, Output, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import { TypeService, StatusService, PersonnelService } from '@app/core/services';
import { Type, Status } from '@app/core/models';
import { User } from '@app/core/auth';
import { debounceTime } from 'rxjs/operators';
import { DateFrToEnPipe } from '@app/core/_base/layout';


@Component({
  selector: 'tf-visite-revue-filters',
  templateUrl: './visite-revue-filters.component.html',
  styleUrls: ['./visite-revue-filters.component.scss'],
})

export class VisiteRevueFiltersComponent implements OnInit, AfterViewInit
{
  
  filterForm: FormGroup;
  loading = false;
  hidden = true;
  data: boolean = false;
  users: User[];
  status: Status[];
  types: Type[];
  visiteOptions = [
    {key: 'Avec', value: 'FILTER.SEARCH_WITH'},
    {key: 'Sans', value: 'FILTER.SEARCH_WITHOUT'}
  ]
  analyseOptions = [
    {key: 'Avec', value: 'FILTER.SEARCH_WITH'},
    {key: 'Sans', value: 'FILTER.SEARCH_WITHOUT'}
  ]
  entrepriseOptions = [
    {key: 'Avec', value: 'FILTER.SEARCH_WITH'},
    {key: 'Sans', value: 'FILTER.SEARCH_WITHOUT'}
  ]
  statuses;

  @Output() change = new EventEmitter();
  constructor(
    private statusService: StatusService,
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
    var res = await this.typeService.getAllFromModel('VsRevue').toPromise();
    this.types = res.result.data;
    this.cdr.markForCheck();
  }
  
  initFiltersForm(){
    this.filterForm = this.fb.group({
      redacteur_id:[null],
      visited_id:[null],
      personnel_id:[null],
      // status_id:[null],
      type_id:[null],
      date_visite_start:[null],
      date_visite_end:[null],
    })
  }
 
  search(filters: any): void {
    var filter = {...this.filterForm.getRawValue()}
    filter.date_visite_start = this.dateFrToEnPipe.transform(filter.date_visite_start);
    filter.date_visite_end = this.dateFrToEnPipe.transform(filter.date_visite_end);
    this.change.emit(filter);
  }

  formHasValue(key){
    return this.filterForm.get(key).value ? true:false;
  }
  clearValue(key){
    this.filterForm.get(key).patchValue(null);
  }

}
