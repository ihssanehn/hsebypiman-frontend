import { ChangeDetectorRef, Component, OnInit, EventEmitter, Output, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import { TypeService, EntrepriseService, PersonnelService } from '@app/core/services';
import { Type, Status, Entreprise } from '@app/core/models';
import { User } from '@app/core/auth';
import { debounceTime } from 'rxjs/operators';
import { DateFrToEnPipe } from '@app/core/_base/layout';


@Component({
  selector: 'tf-visite-vehicule-filters',
  templateUrl: './visite-vehicule-filters.component.html',
  styleUrls: ['./visite-vehicule-filters.component.scss'],
})

export class VisiteVehiculeFiltersComponent implements OnInit, AfterViewInit
{
  
  filterForm: FormGroup;
  loading = false;
  hidden = true;
  data: boolean = false;
  users: User[];
  status: Status[];
  types: Type[];
  clients: String[];
  entreprises: Entreprise[];
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
    this.getUsers();
    this.getTypes();
    this.getEntreprises();
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
  async getEntreprises(){
    var res = await this.entrepriseService.getList().toPromise();
    this.entreprises = res.result.data;
    this.cdr.markForCheck();
  }
  async getTypes(){
    var res = await this.typeService.getAllFromModel('VsVehicule').toPromise();
    this.types = res.result.data;
    this.cdr.markForCheck();
  }
  
  initFiltersForm(){
    this.filterForm = this.fb.group({
      vehicule:[null],
      redacteur_id:[null],
      visited_id:[null],
      personnel_id:[null],
      type_id:[null],
      date_visite_start:[null],
      date_visite_end:[null]
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
